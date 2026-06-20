<?php
require_once '../auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../../../backend/config/database.php';
require_once __DIR__ . '/../../../backend/utils/SecureFileUpload.php';
require_once __DIR__ . '/../../../backend/utils/Translator.php';
require_once __DIR__ . '/../../../backend/helpers/csrf_helper.php';

$success_message = '';
$error_message = '';

// Handle success redirect
if (isset($_GET['success'])) {
    $success_message = "Member updated successfully!";
}

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
    $r = $conn->query("SHOW COLUMNS FROM member_roles LIKE 'position_en'");
    if ($r && $r->num_rows === 0) $conn->query("ALTER TABLE member_roles ADD COLUMN position_en VARCHAR(255) DEFAULT NULL");

    if (isset($_GET['id'])) {
        $stmt = $conn->prepare("
            SELECT
                u.id,
                u.username,
                u.email,
                u.full_name,
                u.role,
                u.team,
                u.department,
                u.status,
                u.phone,
                t.position,
                t.position_en,
                t.study_field,
                t.faculty,
                t.academic_year,
                t.motivation,
                t.skills,
                t.profile_picture
            FROM users u
            LEFT JOIN team_members t ON u.id = t.user_id
            WHERE u.id = ?
        ");

        $stmt->bind_param("i", $_GET['id']);
        $stmt->execute();
        $member_data = $stmt->get_result()->fetch_assoc();

        // Load existing roles from member_roles table
        $existing_roles = [];
        if ($member_data) {
            $roles_stmt = $conn->prepare("SELECT role, team, department, position, position_en FROM member_roles WHERE user_id = ?");
            $roles_stmt->bind_param("i", $_GET['id']);
            $roles_stmt->execute();
            $roles_result = $roles_stmt->get_result();
            while ($row = $roles_result->fetch_assoc()) {
                $existing_roles[] = $row;
            }
            $roles_stmt->close();

            // Fallback: if no member_roles, build from users table
            if (empty($existing_roles)) {
                $existing_roles[] = [
                    'role' => $member_data['role'],
                    'team' => $member_data['team'],
                    'department' => $member_data['department'],
                    'position' => $member_data['position'],
                    'position_en' => $member_data['position_en'] ?? null
                ];
            }
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        csrf_check();
        $conn->begin_transaction();

        try {
            // Handle profile picture upload with secure validation
            $profile_picture = $member_data['profile_picture'];

            if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] !== UPLOAD_ERR_NO_FILE) {
                $upload_dir = __DIR__ . '/../../uploads/profiles/';
                $uploader = new SecureFileUpload($upload_dir, ['image'], 5 * 1024 * 1024);

                $new_filename = $uploader->upload($_FILES['profile_picture']);

                if ($new_filename) {
                    if ($member_data['profile_picture'] && file_exists($upload_dir . $member_data['profile_picture'])) {
                        unlink($upload_dir . $member_data['profile_picture']);
                    }
                    $profile_picture = $new_filename;
                } else {
                    throw new Exception($uploader->getLastError());
                }
            }

            // Build role entries from POST arrays
            $roles = $_POST['roles'] ?? [];
            $role_teams = $_POST['role_teams'] ?? [];
            $role_departments = $_POST['role_departments'] ?? [];
            $role_positions = $_POST['role_positions'] ?? [];
            $role_positions_en = $_POST['role_positions_en'] ?? [];

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

            $userId = $_GET['id'];

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
                    $ck = $conn->prepare("SELECT COUNT(*) as c FROM users WHERE role='team_leader' AND status='active' AND id != ?");
                    $ck->bind_param("i", $userId);
                    $ck->execute();
                    if ($ck->get_result()->fetch_assoc()['c'] > 0) {
                        throw new Exception("There is already a Team Leader in the system. Only one Team Leader is allowed.");
                    }
                    $ck->close();
                } else if ($r === 'project_leader') {
                    if (empty($t)) {
                        throw new Exception("Project Leader requires a team selection");
                    }
                    $ck = $conn->prepare("
                        SELECT COUNT(*) as c FROM member_roles mr
                        JOIN users u ON mr.user_id = u.id
                        WHERE mr.role = 'project_leader' AND mr.team = ? AND u.status = 'active' AND mr.user_id != ?
                    ");
                    $ck->bind_param("si", $t, $userId);
                    $ck->execute();
                    if ($ck->get_result()->fetch_assoc()['c'] > 0) {
                        throw new Exception("This team already has a Project Leader");
                    }
                    $ck->close();
                } else {
                    if (empty($t)) {
                        throw new Exception("Team is required for " . str_replace('_', ' ', $r));
                    }
                    if (empty($d)) {
                        throw new Exception("Department is required for " . str_replace('_', ' ', $r));
                    }
                    if ($r === 'sub_leader') {
                        $ck = $conn->prepare("
                            SELECT COUNT(*) as c FROM member_roles mr
                            JOIN users u ON mr.user_id = u.id
                            WHERE mr.role = 'sub_leader' AND mr.team = ? AND mr.department = ? AND u.status = 'active' AND mr.user_id != ?
                        ");
                        $ck->bind_param("ssi", $t, $d, $userId);
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

            $email = $_POST['email'];
            $fullName = $_POST['full_name'];
            $status = $_POST['status'];
            $phone = $_POST['phone'] ?? '';

            // Update users table with primary role
            $update_user = $conn->prepare("UPDATE users SET email = ?, full_name = ?, role = ?, team = ?, department = ?, status = ?, phone = ? WHERE id = ?");
            if (!$update_user) throw new Exception("Update user preparation failed: " . $conn->error);
            $update_user->bind_param("sssssssi", $email, $fullName, $primary_role, $primary_team, $primary_dept, $status, $phone, $userId);
            if (!$update_user->execute()) throw new Exception("Error updating user: " . $update_user->error);
            $update_user->close();

            // Update team_members table
            $position = $entries[$primary_idx]['position'] ?? '';
            $position_en = !empty($entries[$primary_idx]['position_en']) ? $entries[$primary_idx]['position_en'] : null;
            // Auto-translate position if not provided
            if (empty($position_en) && !empty($position)) {
                $translated = Translator::translate($position, 'sr', 'en');
                $position_en = ($translated !== false) ? $translated : $position;
            }
            $studyField = $_POST['study_field'] ?? '';
            $faculty = $_POST['faculty'] ?? '';
            $academicYear = $_POST['academic_year'] ?? '';
            $update_member = $conn->prepare("UPDATE team_members SET position = ?, position_en = ?, study_field = ?, faculty = ?, academic_year = ?, profile_picture = ?, team = ?, department = ? WHERE user_id = ?");
            if (!$update_member) throw new Exception("Update member preparation failed: " . $conn->error);
            $update_member->bind_param("ssssssssi", $position, $position_en, $studyField, $faculty, $academicYear, $profile_picture, $primary_team, $primary_dept, $userId);
            if (!$update_member->execute()) throw new Exception("Error updating member details: " . $update_member->error);
            if ($update_member->affected_rows === 0) {
                // No team_members row yet — insert one
                $ins = $conn->prepare("INSERT INTO team_members (user_id, position, position_en, study_field, faculty, academic_year, profile_picture, team, department, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
                if (!$ins) throw new Exception("Insert team_members failed: " . $conn->error);
                $ins->bind_param("issssssss", $userId, $position, $position_en, $studyField, $faculty, $academicYear, $profile_picture, $primary_team, $primary_dept);
                if (!$ins->execute()) throw new Exception("Error inserting member details: " . $ins->error);
                $ins->close();
            }
            $update_member->close();

            // Replace member_roles: delete old, insert new
            $del_stmt = $conn->prepare("DELETE FROM member_roles WHERE user_id = ?");
            $del_stmt->bind_param("i", $userId);
            $del_stmt->execute();
            $del_stmt->close();

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
                $mr_stmt->bind_param("isssss", $userId, $entry['role'], $mr_team, $mr_dept, $mr_pos, $mr_pos_en);
                $mr_stmt->execute();
                $mr_stmt->close();
            }

            $conn->commit();
            header("Location: edit_member.php?id=" . $_GET['id'] . "&success=1");
            exit;

        } catch (Exception $e) {
            $conn->rollback();
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
    <title>Edit Team Member - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/dashboard.css">
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
        .alert.success {
            background: rgba(40, 167, 69, 0.15);
            border: 1px solid var(--success-color);
            color: #5cb85c;
        }
        .alert.error {
            background: rgba(220, 53, 69, 0.15);
            border: 1px solid var(--danger-color);
            color: #e74c3c;
        }

        /* Form Layout */
        .edit-form {
            max-width: 800px;
        }
        .form-section {
            background: var(--secondary-color);
            padding: 28px;
            border-radius: 12px;
            border: 1px solid rgba(255, 215, 0, 0.08);
            margin-bottom: 1.5rem;
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
        .form-group select,
        .form-group textarea {
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
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }
        .form-group input[readonly] {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .form-group select option {
            background: #2d2d2d;
            color: var(--text-light);
        }
        .form-group textarea {
            min-height: 100px;
            resize: vertical;
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
        .current-picture, .no-picture {
            text-align: center;
            flex-shrink: 0;
        }
        .current-picture img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid var(--primary-color);
        }
        .current-picture p, .no-picture p {
            margin-top: 8px;
            color: var(--text-gray);
            font-size: 0.82rem;
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
            border: 2px dashed rgba(255, 215, 0, 0.15);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.03);
            color: #ccc;
            cursor: pointer;
            transition: border-color 0.3s ease;
        }
        .upload-section input[type="file"]:hover {
            border-color: var(--primary-color);
        }
        .upload-section small {
            display: block;
            margin-top: 6px;
            color: #666;
            font-size: 0.8rem;
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

        /* Status badge inline */
        .status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-left: 12px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        .status-indicator.active { color: var(--success-color); }
        .status-indicator.inactive { color: var(--danger-color); }

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
            .page-header {
                flex-direction: column;
                gap: 1rem;
                align-items: flex-start;
            }
            .profile-picture-section {
                flex-direction: column;
                text-align: center;
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
            <h1>
                <i class="fas fa-user-edit"></i>
                <span data-i18n="editMember">Edit Member</span>
                <?php if ($member_data): ?>
                    — <?php echo htmlspecialchars($member_data['full_name']); ?>
                    <span class="status-indicator <?php echo $member_data['status']; ?>">
                        <i class="fas fa-circle" style="font-size: 0.5rem;"></i>
                        <?php echo ucfirst($member_data['status']); ?>
                    </span>
                <?php endif; ?>
            </h1>
            <a href="manage_members.php" class="back-btn">
                <i class="fas fa-arrow-left"></i> <span data-i18n="backToMembers">Back to Members</span>
            </a>
        </div>

        <?php if ($success_message): ?>
            <div class="alert success">
                <i class="fas fa-check-circle"></i>
                <span data-i18n="memberUpdatedSuccess"><?php echo htmlspecialchars($success_message); ?></span>
            </div>
        <?php endif; ?>

        <?php if ($error_message): ?>
            <div class="alert error">
                <i class="fas fa-exclamation-circle"></i>
                <?php echo htmlspecialchars($error_message); ?>
            </div>
        <?php endif; ?>

        <?php if ($member_data): ?>
            <form method="POST" enctype="multipart/form-data" class="edit-form">
                <?= csrf_token_field() ?>
                <div class="form-section">
                    <h3><i class="fas fa-camera"></i> <span data-i18n="profilePicture">Profile Picture</span></h3>

                    <div class="form-group profile-picture-section">
                        <?php if ($member_data['profile_picture']): ?>
                            <div class="current-picture">
                                <img src="../../uploads/profiles/<?php echo htmlspecialchars($member_data['profile_picture']); ?>"
                                     alt="Profile Picture">
                                <p data-i18n="currentProfilePicture">Current Profile Picture</p>
                            </div>
                        <?php else: ?>
                            <div class="no-picture">
                                <i class="fas fa-user-circle"></i>
                                <p data-i18n="noProfilePicture">No profile picture uploaded</p>
                            </div>
                        <?php endif; ?>

                        <div class="upload-section">
                            <label for="profile_picture" data-i18n="uploadNewProfilePicture">Upload New Profile Picture</label>
                            <input type="file"
                                   name="profile_picture"
                                   id="profile_picture"
                                   accept="image/jpeg,image/jpg,image/png,image/gif">
                            <small data-i18n="allowedFormats">Allowed formats: JPG, PNG, GIF. Maximum size: 5MB</small>
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3><i class="fas fa-id-card"></i> <span data-i18n="basicInformation">Basic Information</span></h3>

                    <div class="form-group">
                        <label for="email" data-i18n="email">Email</label>
                        <input type="email" name="email" value="<?php echo htmlspecialchars($member_data['email']); ?>" required>
                    </div>

                    <div class="form-group">
                        <label for="full_name" data-i18n="fullName">Full Name</label>
                        <input type="text" name="full_name" value="<?php echo htmlspecialchars($member_data['full_name']); ?>" required>
                    </div>

                    <div class="form-group">
                        <label for="phone" data-i18n="phone">Phone</label>
                        <input type="text" name="phone" value="<?php echo htmlspecialchars($member_data['phone'] ?? ''); ?>">
                    </div>

                    <div class="form-group">
                        <label for="status" data-i18n="status">Status</label>
                        <select name="status" required>
                            <option value="active" <?php echo $member_data['status'] === 'active' ? 'selected' : ''; ?> data-i18n="active">Active</option>
                            <option value="inactive" <?php echo $member_data['status'] === 'inactive' ? 'selected' : ''; ?> data-i18n="inactive">Inactive</option>
                        </select>
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

                <div class="form-section">
                    <h3><i class="fas fa-graduation-cap"></i> <span data-i18n="additionalInformation">Additional Information</span></h3>

                    <div class="form-group">
                        <label for="faculty" data-i18n="faculty">Faculty</label>
                        <input type="text" name="faculty" value="<?php echo htmlspecialchars($member_data['faculty'] ?? ''); ?>">
                    </div>

                    <div class="form-group">
                        <label for="study_field" data-i18n="fieldOfStudy">Field of Study</label>
                        <input type="text" name="study_field" value="<?php echo htmlspecialchars($member_data['study_field'] ?? ''); ?>">
                    </div>

                    <div class="form-group">
                        <label for="academic_year" data-i18n="academicYear">Academic Year</label>
                        <input type="text" name="academic_year" value="<?php echo htmlspecialchars($member_data['academic_year'] ?? ''); ?>">
                    </div>

                </div>

                <div class="form-actions">
                    <button type="submit" class="btn-submit">
                        <i class="fas fa-save"></i> <span data-i18n="saveChanges">Save Changes</span>
                    </button>
                    <a href="manage_members.php" class="btn-cancel">
                        <i class="fas fa-times"></i> <span data-i18n="cancel">Cancel</span>
                    </a>
                </div>
            </form>
        <?php else: ?>
            <div class="alert error">
                <i class="fas fa-exclamation-circle"></i>
                <span data-i18n="memberNotFound">Member not found.</span>
            </div>
        <?php endif; ?>
    </div>

    <script>
        var existingRoles = <?php echo json_encode($existing_roles ?? []); ?>;
        var roleEntryCount = 0;

        function createRoleEntry(isFirst) {
            var index = roleEntryCount++;
            var entry = document.createElement('div');
            entry.className = 'role-entry';
            entry.dataset.index = index;

            var teamLeaderOption = isFirst ? '<option value="team_leader" data-i18n="roleTeamLeader">Team Leader</option>' : '';

            entry.innerHTML =
                '<div class="role-entry-header">' +
                    '<span>Role #' + (index + 1) + '</span>' +
                    (!isFirst ? '<button type="button" class="remove-role-btn" onclick="removeRoleEntry(this)"><i class="fas fa-times"></i> <span data-i18n="removeRole">Remove</span></button>' : '') +
                '</div>' +
                '<div class="form-group">' +
                    '<label data-i18n="role">Role</label>' +
                    '<select name="roles[]" class="role-select" onchange="handleEntryRoleChange(this)">' +
                        '<option value="team_member" data-i18n="roleTeamMember">Team Member</option>' +
                        '<option value="sub_leader" data-i18n="roleSubLeader">Sub Leader</option>' +
                        '<option value="project_leader" data-i18n="roleProjectLeader">Project Leader</option>' +
                        teamLeaderOption +
                    '</select>' +
                '</div>' +
                '<div class="form-group entry-team-group">' +
                    '<label data-i18n="team">Team</label>' +
                    '<select name="role_teams[]" class="team-select" onchange="handleEntryTeamChange(this)">' +
                        '<option value="" data-i18n="selectTeam">Select Team</option>' +
                        '<option value="mechanical" data-i18n="mechanicalEngTeam">Mechanical Engineering</option>' +
                        '<option value="electrical" data-i18n="electricalEngTeam">Electrical Engineering</option>' +
                        '<option value="operating_business" data-i18n="businessOpTeam">Business Operating</option>' +
                    '</select>' +
                '</div>' +
                '<div class="form-group entry-dept-group" style="display: none;">' +
                    '<label data-i18n="department">Department</label>' +
                    '<select name="role_departments[]" class="dept-select">' +
                        '<option value="" data-i18n="selectDepartment">Select Department</option>' +
                        '<optgroup label="Mechanical Engineering" class="mech-opts" style="display: none;">' +
                            '<option value="chassis_aero" data-i18n="deptChassisAero">Chassis and Aerodynamics</option>' +
                            '<option value="suspension_steering" data-i18n="deptSuspensionSteering">Suspension and Steering</option>' +
                            '<option value="transmission_braking" data-i18n="deptTransmissionBraking">Transmission and Braking</option>' +
                        '</optgroup>' +
                        '<optgroup label="Electrical Engineering" class="elec-opts" style="display: none;">' +
                            '<option value="high_voltage" data-i18n="deptHighVoltage">High Voltage</option>' +
                            '<option value="low_voltage" data-i18n="deptLowVoltage">Low Voltage</option>' +
                        '</optgroup>' +
                        '<optgroup label="Business Operating" class="bus-opts" style="display: none;">' +
                            '<option value="marketing" data-i18n="deptMarketing">Marketing</option>' +
                            '<option value="sponsorships" data-i18n="deptSponsorships">Sponsorships</option>' +
                            '<option value="management" data-i18n="deptManagement">Management</option>' +
                        '</optgroup>' +
                    '</select>' +
                '</div>' +
                '<div class="form-group entry-position-group">' +
                    '<label data-i18n="position">Position</label>' +
                    '<input type="hidden" name="role_positions[]" class="pos-hidden" value="">' +
                    '<input type="hidden" name="role_positions_en[]" class="pos-en-hidden" value="">' +
                    '<input type="text" class="position-input" placeholder="e.g. Dizajner, Inženjer, Fotograf..." oninput="syncPositionHidden(this)">' +
                    '<small style="color: #888; display: block; margin-top: 4px;"><i class="fas fa-language" style="color: #FFD700;"></i> English translation is auto-generated on save</small>' +
                '</div>';

            return entry;
        }

        function handleEntryRoleChange(select) {
            var entry = select.closest('.role-entry');
            var role = select.value;
            var teamGroup = entry.querySelector('.entry-team-group');
            var deptGroup = entry.querySelector('.entry-dept-group');
            var teamSelect = entry.querySelector('.team-select');
            var deptSelect = entry.querySelector('.dept-select');
            var posGroup = entry.querySelector('.entry-position-group');

            if (role === 'team_leader') {
                teamGroup.style.display = 'none';
                deptGroup.style.display = 'none';
                posGroup.style.display = 'none';
                teamSelect.value = '';
                deptSelect.value = '';
            } else if (role === 'project_leader') {
                teamGroup.style.display = 'block';
                deptGroup.style.display = 'none';
                posGroup.style.display = 'none';
                deptSelect.value = '';
            } else {
                teamGroup.style.display = 'block';
                posGroup.style.display = 'block';
                handleEntryTeamChange(teamSelect);
            }

            checkRoleMode();
        }

        function handleEntryTeamChange(select) {
            var entry = select.closest('.role-entry');
            var role = entry.querySelector('.role-select').value;
            var team = select.value;
            var deptGroup = entry.querySelector('.entry-dept-group');
            var deptSelect = entry.querySelector('.dept-select');

            if (role === 'team_leader' || role === 'project_leader') {
                deptGroup.style.display = 'none';
            } else {
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

        function checkRoleMode() {
            var firstRoleSelect = document.querySelector('.role-entry .role-select');
            var isTeamLeader = firstRoleSelect && firstRoleSelect.value === 'team_leader';
            var addRoleBtn = document.getElementById('add-role-btn');

            addRoleBtn.style.display = 'flex';

            if (isTeamLeader) {
                // Hide team/dept/position only for the team_leader entry itself
                var firstEntry = document.querySelector('.role-entry');
                if (firstEntry) {
                    firstEntry.querySelector('.entry-team-group').style.display = 'none';
                    firstEntry.querySelector('.entry-dept-group').style.display = 'none';
                    firstEntry.querySelector('.entry-position-group').style.display = 'none';
                }
            }

            // Restore visibility for all non-team-leader, non-project-leader entries
            document.querySelectorAll('.role-entry').forEach(function(entry) {
                var role = entry.querySelector('.role-select').value;
                if (role !== 'team_leader' && role !== 'project_leader') {
                    entry.querySelector('.entry-position-group').style.display = 'block';
                }
            });
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

            // Pre-populate existing roles
            if (existingRoles.length > 0) {
                existingRoles.forEach(function(roleData, idx) {
                    var entry = createRoleEntry(idx === 0);
                    container.appendChild(entry);

                    // Set role
                    var roleSelect = entry.querySelector('.role-select');
                    roleSelect.value = roleData.role;
                    handleEntryRoleChange(roleSelect);

                    // Set team
                    if (roleData.team) {
                        var teamSelect = entry.querySelector('.team-select');
                        teamSelect.value = roleData.team;
                        handleEntryTeamChange(teamSelect);
                    }

                    // Set department
                    if (roleData.department) {
                        var deptSelect = entry.querySelector('.dept-select');
                        deptSelect.value = roleData.department;
                    }

                    // Set position
                    if (roleData.position) {
                        var posInput = entry.querySelector('.position-input');
                        var posHidden = entry.querySelector('.pos-hidden');
                        var posEnHidden = entry.querySelector('.pos-en-hidden');

                        posInput.value = roleData.position;
                        posHidden.value = roleData.position;
                        posEnHidden.value = roleData.position_en || '';
                    }
                });
            } else {
                container.appendChild(createRoleEntry(true));
            }

            updateEntryNumbers();

            document.getElementById('add-role-btn').addEventListener('click', function() {
                container.appendChild(createRoleEntry(false));
                updateEntryNumbers();
            });

            // Form submit: ensure position hidden fields are set
            document.querySelector('form').addEventListener('submit', function(e) {
                document.querySelectorAll('.role-entry').forEach(function(entry) {
                    var posInput = entry.querySelector('.position-input');
                    if (posInput) {
                        entry.querySelector('.pos-hidden').value = posInput.value.trim();
                    }
                });

                var entries = document.querySelectorAll('.role-entry');
                for (var j = 0; j < entries.length; j++) {
                    var ent = entries[j];
                    var role = ent.querySelector('.role-select').value;
                    var team = ent.querySelector('.team-select').value;
                    var dept = ent.querySelector('.dept-select').value;

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

            // Auto-hide success alert
            var successAlert = document.querySelector('.alert.success');
            if (successAlert) {
                setTimeout(function() {
                    successAlert.style.transition = 'opacity 0.5s ease';
                    successAlert.style.opacity = '0';
                    setTimeout(function() { successAlert.remove(); }, 500);
                }, 3000);
            }
        });
    </script>
</body>
</html>

<?php
if (isset($conn)) {
    $conn->close();
}
?>
