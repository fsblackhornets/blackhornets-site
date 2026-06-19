<?php
require_once '../auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../../../backend/config/database.php';
require_once __DIR__ . '/../../../backend/utils/SecureFileUpload.php';
require_once __DIR__ . '/../../../backend/utils/Translator.php';
require_once __DIR__ . '/../../../backend/helpers/csrf_helper.php';

$success_message = '';
$error_message = '';

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Auto-migrate: ensure all required team_members columns exist
    foreach ([
        'age'           => "ALTER TABLE team_members ADD COLUMN age INT DEFAULT 0",
        'academic_year' => "ALTER TABLE team_members ADD COLUMN academic_year VARCHAR(20) DEFAULT NULL",
        'motivation'    => "ALTER TABLE team_members ADD COLUMN motivation TEXT DEFAULT NULL",
        'skills'        => "ALTER TABLE team_members ADD COLUMN skills TEXT DEFAULT NULL",
        'date_of_birth' => "ALTER TABLE team_members ADD COLUMN date_of_birth DATE NULL",
        'faculty'       => "ALTER TABLE team_members ADD COLUMN faculty VARCHAR(100) DEFAULT ''",
        'position_en'   => "ALTER TABLE team_members ADD COLUMN position_en VARCHAR(255) DEFAULT NULL",
        'projects'      => "ALTER TABLE team_members ADD COLUMN projects TEXT DEFAULT NULL",
        'achievements'  => "ALTER TABLE team_members ADD COLUMN achievements TEXT DEFAULT NULL",
    ] as $col => $sql) {
        $r = $conn->query("SHOW COLUMNS FROM team_members LIKE '$col'");
        if ($r && $r->num_rows === 0) $conn->query($sql);
    }

    // Auto-migrate: create member_roles table and ensure its columns exist
    $conn->query("CREATE TABLE IF NOT EXISTS member_roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        role VARCHAR(50) NOT NULL,
        team VARCHAR(50) DEFAULT NULL,
        department VARCHAR(50) DEFAULT NULL,
        position VARCHAR(255) DEFAULT NULL,
        position_en VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_member_roles_user (user_id)
    )");
    foreach ([
        'position'    => "ALTER TABLE member_roles ADD COLUMN position VARCHAR(255) DEFAULT NULL",
        'position_en' => "ALTER TABLE member_roles ADD COLUMN position_en VARCHAR(255) DEFAULT NULL",
    ] as $col => $sql) {
        $r = $conn->query("SHOW COLUMNS FROM member_roles LIKE '$col'");
        if ($r && $r->num_rows === 0) $conn->query($sql);
    }

    // Populate missing member_roles from existing users
    $conn->query("
        INSERT INTO member_roles (user_id, role, team, department, position)
        SELECT u.id, u.role, u.team, u.department, tm.position
        FROM users u
        LEFT JOIN member_roles mr ON u.id = mr.user_id
        LEFT JOIN team_members tm ON u.id = tm.user_id
        WHERE mr.id IS NULL AND u.role != 'admin' AND u.status = 'active'
    ");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        csrf_check();
        $conn->begin_transaction();

        try {
            $roles = $_POST['roles'] ?? [];
            $role_teams = $_POST['role_teams'] ?? [];
            $role_departments = $_POST['role_departments'] ?? [];
            $role_positions = $_POST['role_positions'] ?? [];
            $role_positions_en = $_POST['role_positions_en'] ?? [];

            // Build entries array
            $entries = [];
            foreach ($roles as $i => $r) {
                $r = trim($r);
                if (!empty($r)) {
                    $entries[] = [
                        'role' => $r,
                        'team' => trim($role_teams[$i] ?? ''),
                        'department' => trim($role_departments[$i] ?? ''),
                        'position' => trim($role_positions[$i] ?? ''),
                        'position_en' => trim($role_positions_en[$i] ?? '')
                    ];
                }
            }

            if (empty($entries)) {
                throw new Exception("At least one role is required");
            }

            $is_admin = ($entries[0]['role'] === 'admin');

            if ($is_admin) {
                // Admin flow
                $email = 'admin@blackhornets.local';
                $full_name = 'Admin';
                $phone = '';
                $username = trim($_POST['username'] ?? '');
                $password = $_POST['password'] ?? '';

                if (empty($username) || empty($password)) {
                    throw new Exception("Username and password are required for admin accounts");
                }

                $check_stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
                if (!$check_stmt) throw new Exception("Prepare failed: " . $conn->error);
                $check_stmt->bind_param("s", $username);
                $check_stmt->execute();
                if ($check_stmt->get_result()->num_rows > 0) {
                    throw new Exception("Username already exists");
                }
                $check_stmt->close();

                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $primary_role = 'admin';
                $primary_team = null;
                $primary_dept = null;

            } else {
                // Non-admin flow
                $email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
                $full_name = trim($_POST['full_name']);
                $phone = trim($_POST['phone'] ?? '');

                if (!$email) {
                    throw new Exception("Invalid email format");
                }

                // Validate each role entry
                $valid_departments = [
                    'mechanical' => ['chassis_aero', 'suspension_steering', 'transmission_braking'],
                    'electrical' => ['high_voltage', 'low_voltage'],
                    'operating_business' => ['marketing', 'sponsorships', 'management']
                ];

                foreach ($entries as $entry) {
                    $r = $entry['role'];
                    $t = $entry['team'];
                    $d = $entry['department'];

                    if ($r === 'team_leader') {
                        $ck = $conn->query("SELECT COUNT(*) as c FROM users WHERE role='team_leader' AND status='active'");
                        if ($ck->fetch_assoc()['c'] > 0) {
                            throw new Exception("There is already a Team Leader in the system. Only one Team Leader is allowed.");
                        }
                    } else if ($r === 'project_leader') {
                        if (empty($t)) {
                            throw new Exception("Project Leader requires a team selection");
                        }
                        if (!isset($valid_departments[$t])) {
                            throw new Exception("Invalid team selected: " . $t);
                        }
                        $ck = $conn->prepare("
                            SELECT COUNT(*) as c FROM member_roles mr
                            JOIN users u ON mr.user_id = u.id
                            WHERE mr.role = 'project_leader' AND mr.team = ? AND u.status = 'active'
                        ");
                        $ck->bind_param("s", $t);
                        $ck->execute();
                        if ($ck->get_result()->fetch_assoc()['c'] > 0) {
                            throw new Exception("This team already has a Project Leader");
                        }
                        $ck->close();
                    } else {
                        // sub_leader or team_member
                        if (empty($t)) {
                            throw new Exception("Team is required for " . str_replace('_', ' ', $r));
                        }
                        if (empty($d)) {
                            throw new Exception("Department is required for " . str_replace('_', ' ', $r));
                        }
                        if (!isset($valid_departments[$t]) || !in_array($d, $valid_departments[$t])) {
                            throw new Exception("Invalid department '" . $d . "' for team: " . $t);
                        }
                        if ($r === 'sub_leader') {
                            $ck = $conn->prepare("
                                SELECT COUNT(*) as c FROM member_roles mr
                                JOIN users u ON mr.user_id = u.id
                                WHERE mr.role = 'sub_leader' AND mr.team = ? AND mr.department = ? AND u.status = 'active'
                            ");
                            $ck->bind_param("ss", $t, $d);
                            $ck->execute();
                            if ($ck->get_result()->fetch_assoc()['c'] > 0) {
                                throw new Exception("This department already has a Sub Leader");
                            }
                            $ck->close();
                        }
                    }
                }

                // Determine primary role (highest priority)
                $role_priority = ['team_leader' => 4, 'project_leader' => 3, 'sub_leader' => 2, 'team_member' => 1];
                $primary_idx = 0;
                foreach ($entries as $i => $entry) {
                    if (($role_priority[$entry['role']] ?? 0) > ($role_priority[$entries[$primary_idx]['role']] ?? 0)) {
                        $primary_idx = $i;
                    }
                }
                $primary_role = $entries[$primary_idx]['role'];
                $primary_team = !empty($entries[$primary_idx]['team']) ? $entries[$primary_idx]['team'] : null;
                $primary_dept = !empty($entries[$primary_idx]['department']) ? $entries[$primary_idx]['department'] : null;

                // If primary role has no team, use first entry that has one
                if (empty($primary_team)) {
                    foreach ($entries as $entry) {
                        if (!empty($entry['team'])) {
                            $primary_team = $entry['team'];
                            $primary_dept = !empty($entry['department']) ? $entry['department'] : null;
                            break;
                        }
                    }
                }

                // Auto-generate username
                $base_username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', $full_name));
                $base_username = preg_replace('/_+/', '_', trim($base_username, '_'));
                $username = $base_username;
                $suffix = 1;

                $check_stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
                if (!$check_stmt) throw new Exception("Prepare failed: " . $conn->error);
                $check_stmt->bind_param("s", $username);
                $check_stmt->execute();
                while ($check_stmt->get_result()->num_rows > 0) {
                    $username = $base_username . '_' . $suffix;
                    $suffix++;
                    $check_stmt->bind_param("s", $username);
                    $check_stmt->execute();
                }
                $check_stmt->close();

                $hashed_password = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
            }

            // Insert user
            $user_stmt = $conn->prepare("
                INSERT INTO users (
                    username, password, email, full_name, role, team, department, phone, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())
            ");
            if (!$user_stmt) throw new Exception("Prepare failed for users table: " . $conn->error);
            $user_stmt->bind_param("ssssssss",
                $username, $hashed_password, $email, $full_name,
                $primary_role, $primary_team, $primary_dept, $phone
            );
            if (!$user_stmt->execute()) {
                throw new Exception("Error adding user: " . $user_stmt->error);
            }
            $user_id = $conn->insert_id;
            $user_stmt->close();

            // Insert team_members (for non-admin)
            if (!$is_admin) {
                $position = $entries[$primary_idx]['position'] ?? '';
                $position_en = !empty($entries[$primary_idx]['position_en']) ? $entries[$primary_idx]['position_en'] : null;
                // Auto-translate position if not provided
                if (empty($position_en) && !empty($position)) {
                    $translated = Translator::translate($position, 'sr', 'en');
                    $position_en = ($translated !== false) ? $translated : $position;
                }
                $study_field = trim($_POST['study'] ?? '');
                $faculty = trim($_POST['faculty'] ?? '');
                $academic_year = trim($_POST['year'] ?? '');
                $member_stmt = $conn->prepare("
                    INSERT INTO team_members (
                        user_id, position, position_en, created_at, academic_year,
                        study_field, faculty, department, team
                    ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)
                ");
                if (!$member_stmt) throw new Exception("Prepare failed for team_members: " . $conn->error);
                $member_stmt->bind_param("isssssss",
                    $user_id, $position, $position_en, $academic_year, $study_field,
                    $faculty, $primary_dept, $primary_team
                );
                if (!$member_stmt->execute()) {
                    throw new Exception("Error adding team member: " . $member_stmt->error);
                }
                $member_stmt->close();

                // Handle profile picture upload
                if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] !== UPLOAD_ERR_NO_FILE) {
                    $upload_dir = __DIR__ . '/../../uploads/profiles/';
                    $uploader = new SecureFileUpload($upload_dir, ['image'], 5 * 1024 * 1024);
                    $new_filename = $uploader->upload($_FILES['profile_picture']);
                    if ($new_filename) {
                        $pic_stmt = $conn->prepare("UPDATE team_members SET profile_picture = ? WHERE user_id = ?");
                        if ($pic_stmt) {
                            $pic_stmt->bind_param("si", $new_filename, $user_id);
                            $pic_stmt->execute();
                            $pic_stmt->close();
                        }
                    } else {
                        throw new Exception($uploader->getLastError());
                    }
                }

                // Insert member_roles entries
                foreach ($entries as $entry) {
                    $mr_team = !empty($entry['team']) ? $entry['team'] : null;
                    $mr_dept = !empty($entry['department']) ? $entry['department'] : null;
                    $mr_pos = !empty($entry['position']) ? $entry['position'] : null;
                    $mr_pos_en = !empty($entry['position_en']) ? $entry['position_en'] : null;
                    if (empty($mr_pos_en) && !empty($mr_pos)) {
                        $t = Translator::translate($mr_pos, 'sr', 'en');
                        $mr_pos_en = ($t !== false) ? $t : $mr_pos;
                    }
                    $mr_stmt = $conn->prepare("INSERT INTO member_roles (user_id, role, team, department, position, position_en) VALUES (?, ?, ?, ?, ?, ?)");
                    if (!$mr_stmt) throw new Exception("Prepare failed for member_roles: " . $conn->error);
                    $mr_stmt->bind_param("isssss", $user_id, $entry['role'], $mr_team, $mr_dept, $mr_pos, $mr_pos_en);
                    $mr_stmt->execute();
                    $mr_stmt->close();
                }
            }

            $conn->commit();
            $success_message = "User added successfully!";
            header("refresh:2;url=manage_members.php");

        } catch (Exception $e) {
            if (isset($conn)) {
                $conn->rollback();
            }
            $error_message = $e->getMessage();
        }
    }
} catch (Exception $e) {
    $error_message = $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/frontend/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add New User - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../assets/css/dashboard.css">
    <style>
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        .page-header h1 {
            color: var(--primary-color);
            font-size: 1.8rem;
            font-weight: 600;
            margin: 0;
        }
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: var(--secondary-color);
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }
        .back-btn:hover {
            background: var(--primary-color);
            color: var(--dark-bg);
        }

        /* Alerts */
        .alert {
            padding: 16px 20px;
            margin-bottom: 1.5rem;
            border-radius: 10px;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .alert-success {
            background: rgba(40, 167, 69, 0.15);
            border: 1px solid var(--success-color);
            color: #5cb85c;
        }
        .alert-error {
            background: rgba(220, 53, 69, 0.15);
            border: 1px solid var(--danger-color);
            color: #e74c3c;
        }
        .alert.fade-out {
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        /* Form Grid */
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        .form-section {
            background: var(--secondary-color);
            padding: 28px;
            border-radius: 12px;
            border: 1px solid rgba(255, 215, 0, 0.08);
        }
        .form-section h3 {
            color: var(--primary-color);
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            font-weight: 600;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 215, 0, 0.1);
        }
        .form-group {
            margin-bottom: 1.2rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 6px;
            color: var(--text-gray);
            font-size: 0.9rem;
            font-weight: 500;
        }
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 10px 14px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--text-light);
            font-size: 0.95rem;
            font-family: 'Poppins', sans-serif;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }
        .form-group input::placeholder {
            color: #555;
        }
        .form-group select option {
            background: #2d2d2d;
            color: var(--text-light);
        }

        /* Form Actions */
        .form-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
        }
        .btn-submit {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 32px;
            background: var(--primary-color);
            color: var(--dark-bg);
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            font-family: 'Poppins', sans-serif;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-submit:hover {
            background: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }
        .btn-cancel {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 32px;
            background: transparent;
            color: var(--text-gray);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            font-family: 'Poppins', sans-serif;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-cancel:hover {
            border-color: var(--danger-color);
            color: var(--danger-color);
        }

        /* Info message */
        .info-message {
            background: rgba(255, 215, 0, 0.08);
            color: var(--primary-color);
            padding: 10px 14px;
            border-radius: 8px;
            border-left: 3px solid var(--primary-color);
            margin: 10px 0;
            font-size: 0.88rem;
        }

        /* Profile Picture */
        .profile-picture-section {
            display: flex;
            gap: 28px;
            align-items: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 10px;
        }
        .no-picture {
            text-align: center;
            flex-shrink: 0;
        }
        .no-picture i {
            font-size: 60px;
            color: #444;
        }
        .upload-section {
            flex: 1;
        }
        .upload-section label {
            display: block;
            margin-bottom: 8px;
            color: var(--text-gray);
            font-size: 0.9rem;
            font-weight: 500;
        }
        .upload-section input[type="file"] {
            width: 100%;
            padding: 10px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--text-light);
            font-size: 0.9rem;
        }
        .upload-section small {
            display: block;
            margin-top: 6px;
            color: #666;
            font-size: 0.8rem;
        }

        /* Role Entries */
        .role-entry {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
        }
        .role-entry-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .role-entry-header span {
            color: var(--primary-color);
            font-size: 0.9rem;
            font-weight: 500;
        }
        .remove-role-btn {
            background: none;
            border: 1px solid rgba(220, 53, 69, 0.3);
            color: #e74c3c;
            cursor: pointer;
            font-size: 0.85rem;
            padding: 4px 10px;
            border-radius: 6px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 4px;
            font-family: 'Poppins', sans-serif;
        }
        .remove-role-btn:hover {
            background: rgba(220, 53, 69, 0.15);
            border-color: #e74c3c;
        }
        .add-role-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            width: 100%;
            background: rgba(255, 215, 0, 0.08);
            color: var(--primary-color);
            border: 1px dashed rgba(255, 215, 0, 0.3);
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            font-family: 'Poppins', sans-serif;
            transition: all 0.3s ease;
        }
        .add-role-btn:hover {
            background: rgba(255, 215, 0, 0.15);
            border-color: var(--primary-color);
        }

        .custom-position-fields input {
            width: 100%;
            padding: 10px 14px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--text-light);
            font-size: 0.95rem;
            font-family: 'Poppins', sans-serif;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .custom-position-fields input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }
        .custom-position-fields input::placeholder {
            color: #555;
        }

        @media (max-width: 768px) {
            .form-grid {
                grid-template-columns: 1fr;
            }
            .page-header {
                flex-direction: column;
                gap: 1rem;
                align-items: flex-start;
            }
            .form-actions {
                flex-direction: column;
            }
            .btn-submit, .btn-cancel {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

        <div class="page-header">
            <h1><i class="fas fa-user-plus"></i> <span data-i18n="addNewUser">Add New User</span></h1>
            <a href="manage_members.php" class="back-btn">
                <i class="fas fa-arrow-left"></i> <span data-i18n="backToMembers">Back to Members</span>
            </a>
        </div>

        <?php if ($success_message): ?>
            <div class="alert alert-success" id="successAlert">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong data-i18n="userAddedSuccess">User added successfully!</strong>
                    <div data-i18n="redirectingToMembers">Redirecting to members page...</div>
                </div>
            </div>
        <?php endif; ?>

        <?php if ($error_message): ?>
            <div class="alert alert-error" id="errorAlert">
                <i class="fas fa-exclamation-circle"></i>
                <?php echo htmlspecialchars($error_message); ?>
            </div>
        <?php endif; ?>

        <?php
            // Pre-fill from application data if redirected from applications list
            $prefill = [
                'full_name' => htmlspecialchars($_GET['full_name'] ?? ''),
                'email' => htmlspecialchars($_GET['email'] ?? ''),
                'phone' => htmlspecialchars($_GET['phone'] ?? ''),
                'faculty' => htmlspecialchars($_GET['faculty'] ?? ''),
                'study' => htmlspecialchars($_GET['study'] ?? ''),
                'year' => htmlspecialchars($_GET['year'] ?? ''),
                'position' => htmlspecialchars($_GET['position'] ?? ''),
            ];
            $from_application = isset($_GET['from_application']);
        ?>

        <form method="POST" enctype="multipart/form-data">
            <?= csrf_token_field() ?>
            <div class="form-grid">
                <div class="form-section">
                    <h3><i class="fas fa-id-card"></i> <span data-i18n="basicInformation">Basic Information</span></h3>

                    <?php if ($from_application): ?>
                        <div class="info-message">
                            <i class="fas fa-info-circle"></i> <span data-i18n="prefilledFromApplication">Pre-filled from application.</span>
                        </div>
                    <?php endif; ?>

                    <div id="admin-credentials" style="display: none;">
                        <div class="form-group">
                            <label for="username" data-i18n="username">Username</label>
                            <input type="text" id="username" name="username">
                        </div>
                        <div class="form-group">
                            <label for="password" data-i18n="password">Password</label>
                            <input type="password" id="password" name="password">
                        </div>
                    </div>

                    <div id="member-fields">
                        <div class="form-group">
                            <label for="email" data-i18n="email">Email</label>
                            <input type="email" id="email" name="email" value="<?php echo $prefill['email']; ?>" required>
                        </div>

                        <div class="form-group">
                            <label for="full_name" data-i18n="fullName">Full Name</label>
                            <input type="text" id="full_name" name="full_name" value="<?php echo $prefill['full_name']; ?>" required>
                        </div>

                        <div class="form-group">
                            <label for="phone" data-i18n="phone">Phone</label>
                            <input type="text" id="phone" name="phone" value="<?php echo $prefill['phone']; ?>">
                        </div>

                        <div class="form-group">
                            <label for="faculty" data-i18n="faculty">Faculty</label>
                            <input type="text" id="faculty" name="faculty" value="<?php echo $prefill['faculty']; ?>">
                        </div>
                        <div class="form-group">
                            <label for="study" data-i18n="fieldOfStudy">Field of Study</label>
                            <input type="text" id="study" name="study" value="<?php echo $prefill['study']; ?>">
                        </div>
                        <div class="form-group">
                            <label for="year" data-i18n="academicYear">Academic Year</label>
                            <input type="text" id="year" name="year" value="<?php echo $prefill['year']; ?>">
                        </div>

                        <div class="form-group profile-picture-section">
                            <div class="no-picture">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div class="upload-section">
                                <label for="profile_picture" data-i18n="profilePicture">Profile Picture</label>
                                <input type="file"
                                       name="profile_picture"
                                       id="profile_picture"
                                       accept="image/jpeg,image/jpg,image/png,image/gif">
                                <small data-i18n="allowedFormats">Allowed formats: JPG, PNG, GIF. Maximum size: 5MB</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-section" id="team-section">
                    <h3><i class="fas fa-users-cog"></i> <span data-i18n="roleAssignments">Role Assignments</span></h3>

                    <div id="role-entries-container">
                        <!-- Role entries dynamically created by JS -->
                    </div>

                    <button type="button" class="add-role-btn" id="add-role-btn" style="margin-top: 0.5rem;">
                        <i class="fas fa-plus"></i> <span data-i18n="addAnotherRole">Add Another Role</span>
                    </button>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-submit">
                    <i class="fas fa-user-plus"></i> <span data-i18n="addUser">Add User</span>
                </button>
                <a href="manage_members.php" class="btn-cancel">
                    <i class="fas fa-times"></i> <span data-i18n="cancel">Cancel</span>
                </a>
            </div>
        </form>
    </div>

    <script>
        const isSessionAdmin = <?php echo $_SESSION['role'] === 'admin' ? 'true' : 'false'; ?>;
        let roleEntryCount = 0;

        function createRoleEntry(isFirst) {
            const index = roleEntryCount++;
            const entry = document.createElement('div');
            entry.className = 'role-entry';
            entry.dataset.index = index;

            let adminOption = '';
            if (isFirst && isSessionAdmin) {
                adminOption = '<option value="admin" data-i18n="roleAdmin">Admin</option>';
            }
            let teamLeaderOption = '';
            if (isFirst) {
                teamLeaderOption = '<option value="team_leader" data-i18n="roleTeamLeader">Team Leader</option>';
            }

            entry.innerHTML = `
                <div class="role-entry-header">
                    <span>Role #${index + 1}</span>
                    ${!isFirst ? '<button type="button" class="remove-role-btn" onclick="removeRoleEntry(this)"><i class="fas fa-times"></i> <span data-i18n="removeRole">Remove</span></button>' : ''}
                </div>
                <div class="form-group">
                    <label data-i18n="role">Role</label>
                    <select name="roles[]" class="role-select" onchange="handleEntryRoleChange(this)">
                        <option value="team_member" data-i18n="roleTeamMember">Team Member</option>
                        <option value="sub_leader" data-i18n="roleSubLeader">Sub Leader</option>
                        <option value="project_leader" data-i18n="roleProjectLeader">Project Leader</option>
                        ${teamLeaderOption}
                        ${adminOption}
                    </select>
                </div>
                <div class="form-group entry-team-group">
                    <label data-i18n="team">Team</label>
                    <select name="role_teams[]" class="team-select" onchange="handleEntryTeamChange(this)">
                        <option value="" data-i18n="selectTeam">Select Team</option>
                        <option value="mechanical" data-i18n="mechanicalEngTeam">Mechanical Engineering</option>
                        <option value="electrical" data-i18n="electricalEngTeam">Electrical Engineering</option>
                        <option value="operating_business" data-i18n="businessOpTeam">Business Operating</option>
                    </select>
                </div>
                <div class="form-group entry-dept-group" style="display: none;">
                    <label data-i18n="department">Department</label>
                    <select name="role_departments[]" class="dept-select">
                        <option value="" data-i18n="selectDepartment">Select Department</option>
                        <optgroup label="Mechanical Engineering" class="mech-opts" style="display: none;">
                            <option value="chassis_aero" data-i18n="deptChassisAero">Chassis and Aerodynamics</option>
                            <option value="suspension_steering" data-i18n="deptSuspensionSteering">Suspension and Steering</option>
                            <option value="transmission_braking" data-i18n="deptTransmissionBraking">Transmission and Braking</option>
                        </optgroup>
                        <optgroup label="Electrical Engineering" class="elec-opts" style="display: none;">
                            <option value="high_voltage" data-i18n="deptHighVoltage">High Voltage</option>
                            <option value="low_voltage" data-i18n="deptLowVoltage">Low Voltage</option>
                        </optgroup>
                        <optgroup label="Business Operating" class="bus-opts" style="display: none;">
                            <option value="marketing" data-i18n="deptMarketing">Marketing</option>
                            <option value="sponsorships" data-i18n="deptSponsorships">Sponsorships</option>
                            <option value="management" data-i18n="deptManagement">Management</option>
                        </optgroup>
                    </select>
                </div>
                <div class="form-group entry-position-group">
                    <label data-i18n="position">Position</label>
                    <input type="hidden" name="role_positions[]" class="pos-hidden" value="">
                    <input type="hidden" name="role_positions_en[]" class="pos-en-hidden" value="">
                    <input type="text" class="position-input" placeholder="e.g. Dizajner, Inženjer, Fotograf..." oninput="syncPositionHidden(this)">
                    <small style="color: #888; display: block; margin-top: 4px;"><i class="fas fa-language" style="color: #FFD700;"></i> English translation is auto-generated on save</small>
                </div>
            `;

            return entry;
        }

        function handleEntryRoleChange(select) {
            const entry = select.closest('.role-entry');
            const role = select.value;
            const teamGroup = entry.querySelector('.entry-team-group');
            const deptGroup = entry.querySelector('.entry-dept-group');
            const teamSelect = entry.querySelector('.team-select');
            const deptSelect = entry.querySelector('.dept-select');

            if (role === 'admin' || role === 'team_leader') {
                teamGroup.style.display = 'none';
                deptGroup.style.display = 'none';
                teamSelect.value = '';
                deptSelect.value = '';
            } else if (role === 'project_leader') {
                teamGroup.style.display = 'block';
                deptGroup.style.display = 'none';
                deptSelect.value = '';
            } else {
                teamGroup.style.display = 'block';
                handleEntryTeamChange(teamSelect);
            }

            checkAdminMode();
        }

        function handleEntryTeamChange(select) {
            const entry = select.closest('.role-entry');
            const role = entry.querySelector('.role-select').value;
            const team = select.value;
            const deptGroup = entry.querySelector('.entry-dept-group');
            const deptSelect = entry.querySelector('.dept-select');

            if (role === 'admin' || role === 'team_leader' || role === 'project_leader') {
                deptGroup.style.display = 'none';
            } else {
                // Hide all optgroups
                deptSelect.querySelectorAll('optgroup').forEach(function(g) { g.style.display = 'none'; });
                deptSelect.value = '';

                if (team) {
                    deptGroup.style.display = 'block';
                    var groupMap = {
                        'mechanical': '.mech-opts',
                        'electrical': '.elec-opts',
                        'operating_business': '.bus-opts'
                    };
                    var group = deptSelect.querySelector(groupMap[team]);
                    if (group) group.style.display = 'block';
                } else {
                    deptGroup.style.display = 'none';
                }
            }

        }

        function syncPositionHidden(input) {
            var entry = input.closest('.role-entry');
            entry.querySelector('.pos-hidden').value = input.value.trim();
        }

        function checkAdminMode() {
            var firstRoleSelect = document.querySelector('.role-entry .role-select');
            var isAdmin = firstRoleSelect && firstRoleSelect.value === 'admin';
            var isTeamLeader = firstRoleSelect && firstRoleSelect.value === 'team_leader';

            var adminCreds = document.getElementById('admin-credentials');
            var memberFields = document.getElementById('member-fields');
            var addRoleBtn = document.getElementById('add-role-btn');

            adminCreds.style.display = isAdmin ? 'block' : 'none';
            memberFields.style.display = isAdmin ? 'none' : 'block';
            document.getElementById('username').required = isAdmin;
            document.getElementById('password').required = isAdmin;
            document.getElementById('email').required = !isAdmin;
            document.getElementById('full_name').required = !isAdmin;

            if (isAdmin || isTeamLeader) {
                // Remove all entries except first
                var entries = document.querySelectorAll('.role-entry');
                entries.forEach(function(entry, i) {
                    if (i > 0) entry.remove();
                });
                addRoleBtn.style.display = 'none';
                // Hide team/dept/position in first entry
                var firstEntry = document.querySelector('.role-entry');
                if (firstEntry) {
                    firstEntry.querySelector('.entry-team-group').style.display = 'none';
                    firstEntry.querySelector('.entry-dept-group').style.display = 'none';
                    firstEntry.querySelector('.entry-position-group').style.display = 'none';
                }
            } else {
                addRoleBtn.style.display = 'flex';
                // Restore position visibility for non-admin/non-team-leader entries
                document.querySelectorAll('.role-entry').forEach(function(entry) {
                    entry.querySelector('.entry-position-group').style.display = 'block';
                });
            }
        }

        function removeRoleEntry(btn) {
            btn.closest('.role-entry').remove();
            updateEntryNumbers();
        }

        function updateEntryNumbers() {
            document.querySelectorAll('.role-entry').forEach(function(entry, i) {
                entry.querySelector('.role-entry-header span').textContent = 'Role #' + (i + 1);
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            var container = document.getElementById('role-entries-container');
            container.appendChild(createRoleEntry(true));

            document.getElementById('add-role-btn').addEventListener('click', function() {
                container.appendChild(createRoleEntry(false));
                updateEntryNumbers();
            });

            // Form validation
            document.querySelector('form').addEventListener('submit', function(e) {
                // Copy position input values to hidden inputs before submit
                document.querySelectorAll('.role-entry').forEach(function(entry) {
                    var posInput = entry.querySelector('.position-input');
                    if (posInput) {
                        entry.querySelector('.pos-hidden').value = posInput.value.trim();
                    }
                });

                var firstRoleSelect = document.querySelector('.role-entry .role-select');
                if (firstRoleSelect && firstRoleSelect.value === 'admin') return;

                var entries = document.querySelectorAll('.role-entry');
                for (var j = 0; j < entries.length; j++) {
                    var entry = entries[j];
                    var role = entry.querySelector('.role-select').value;
                    var team = entry.querySelector('.team-select').value;
                    var dept = entry.querySelector('.dept-select').value;

                    if (role === 'team_leader') continue;
                    if (role === 'project_leader' && !team) {
                        e.preventDefault();
                        alert('Project Leader requires a team selection');
                        return;
                    }
                    if ((role === 'sub_leader' || role === 'team_member') && (!team || !dept)) {
                        e.preventDefault();
                        alert('Please select both team and department for ' + role.replace(/_/g, ' '));
                        return;
                    }
                }
            });

            // Alert auto-dismiss
            document.querySelectorAll('.alert').forEach(function(alertEl) {
                setTimeout(function() {
                    alertEl.classList.add('fade-out');
                    setTimeout(function() { alertEl.remove(); }, 500);
                }, 3000);
            });
        });
    </script>
</body>
</html>
