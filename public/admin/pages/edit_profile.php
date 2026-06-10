<?php
require_once '../auth.php';
// تمرير مصفوفة الأدوار المسموح بها
$user = checkAuth(['team_member', 'team_leader', 'sub_leader', 'project_leader', 'admin']);

require_once __DIR__ . '/../../../src/config/database.php';
require_once __DIR__ . '/../../../src/utils/SecureFileUpload.php';
try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Auto-migrate: add projects column to team_members
    $col_check = $conn->query("SHOW COLUMNS FROM team_members LIKE 'projects'");
    if ($col_check && $col_check->num_rows === 0) {
        $conn->query("ALTER TABLE team_members ADD COLUMN projects TEXT DEFAULT NULL AFTER skills");
    }

    // Auto-migrate: add achievements column to team_members
    $col_check = $conn->query("SHOW COLUMNS FROM team_members LIKE 'achievements'");
    if ($col_check && $col_check->num_rows === 0) {
        $conn->query("ALTER TABLE team_members ADD COLUMN achievements TEXT DEFAULT NULL AFTER projects");
    }

    // تحديث استعلام جلب بيانات المستخدم
    $stmt = $conn->prepare("
        SELECT 
            u.id,
            u.username,
            u.full_name,
            u.email,
            u.role,
            u.team,
            u.department,
            u.status,
            CASE 
                WHEN u.role = 'sub_leader' THEN 'Sub Leader'
                WHEN u.role = 'project_leader' THEN 'Project Leader'
                WHEN u.role = 'team_leader' THEN 'Team Leader'
                ELSE t.position
            END as position,
            t.study_field,
            t.academic_year,
            t.age,
            t.motivation,
            t.skills,
            t.projects,
            t.achievements,
            t.profile_picture
        FROM users u
        LEFT JOIN team_members t ON u.id = t.user_id
        WHERE u.id = ?
    ");

    if (!$stmt) {
        throw new Exception("Query preparation failed: " . $conn->error);
    }

    $stmt->bind_param("i", $_SESSION['user_id']);
    if (!$stmt->execute()) {
        throw new Exception("Query execution failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $user_data = $result->fetch_assoc();

    if (!$user_data) {
        throw new Exception("User data not found");
    }

    // للتشخيص - طباعة بيانات المستخدم في سجل الأخطاء
    error_log("User data fetched: Role=" . $user_data['role'] . ", Team=" . $user_data['team'] . ", Department=" . $user_data['department']);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $conn->begin_transaction();

            // تحديث البيانات في جدول team_members
            $update_team = $conn->prepare("
                UPDATE team_members 
                SET 
                    age = ?,
                    motivation = ?,
                    skills = ?,
                    projects = ?,
                    achievements = ?
                WHERE user_id = ?
            ");

            if (!$update_team) {
                throw new Exception("Update preparation failed: " . $conn->error);
            }

            $update_team->bind_param("issssi",
                $_POST['age'],
                $_POST['motivation'],
                $_POST['skills'],
                $_POST['projects'],
                $_POST['achievements'],
                $_SESSION['user_id']
            );

            if (!$update_team->execute()) {
                throw new Exception("Update execution failed: " . $update_team->error);
            }

            // معالجة تحميل الصورة بشكل آمن
            if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] !== UPLOAD_ERR_NO_FILE) {
                $upload_dir = __DIR__ . '/../../uploads/profiles/';
                $uploader = new SecureFileUpload($upload_dir, ['image'], 5 * 1024 * 1024); // 5MB max
                
                $new_filename = $uploader->upload($_FILES['profile_picture'], 'profile');
                
                if ($new_filename) {
                    // تحديث اسم الصورة في قاعدة البيانات
                    $update_picture = $conn->prepare("
                        UPDATE team_members 
                        SET profile_picture = ?
                        WHERE user_id = ?
                    ");
                    $update_picture->bind_param("si", $new_filename, $_SESSION['user_id']);
                    $update_picture->execute();
                } else {
                    throw new Exception($uploader->getLastError());
                }
            }

            $conn->commit();
            $success_message = "Profile updated successfully!";

            // إعادة تحميل البيانات
            $stmt->execute();
            $user_data = $stmt->get_result()->fetch_assoc();

        } catch (Exception $e) {
            $conn->rollback();
            $error_message = $e->getMessage();
        }
    }

} catch (Exception $e) {
    $error_message = $e->getMessage();
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($update_team)) $update_team->close();
    if (isset($conn)) $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/public/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Profile</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../assets/css/style.css">
    
    <link rel="stylesheet" href="../../assets/css/edit_profile.css">
</head>
<body>
    <?php include __DIR__ . '/../components/admin_navbar.php'; ?>
    <div class="profile-container">
        <h1 class="page-title">
            <i class="fas fa-user-edit"></i> 
            Black Hornets Profile
        </h1>
        
        <?php if (isset($success_message)): ?>
            <div class="alert success"><?php echo htmlspecialchars($success_message); ?></div>
        <?php endif; ?>
        
        <?php if (isset($error_message)): ?>
            <div class="alert error"><?php echo htmlspecialchars($error_message); ?></div>
        <?php endif; ?>

        <form method="POST" enctype="multipart/form-data" class="profile-form">
            <div class="form-sections">
                <!-- صورة البروفايل - قابلة للتعديل -->
                <div class="profile-picture-section">
                    <div class="profile-picture-container">
                        <img src="<?php 
                            echo !empty($user_data['profile_picture']) ? 
                                '../uploads/profiles/' . htmlspecialchars($user_data['profile_picture']) : 
                                '../assets/images/default-profile.jpg'; 
                            ?>" 
                             alt="Profile Picture" 
                             class="profile-picture" 
                             id="profilePicture">
                        <div class="profile-picture-upload">
                            <label for="profile_picture">
                                <i class="fas fa-camera"></i> Change Picture
                            </label>
                            <input type="file" 
                                   id="profile_picture" 
                                   name="profile_picture" 
                                   accept="image/*"
                                   onchange="previewImage(this)">
                        </div>
                    </div>
                </div>

                <!-- معلومات المستخدم الأساسية -->
                <div class="form-section">
                    <h3 class="section-title">
                        <i class="fas fa-user"></i>
                        Basic Information
                    </h3>
                    
                    <!-- اسم المستخدم - للقراءة فقط -->
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" 
                               class="readonly-field" 
                               value="<?php echo htmlspecialchars($user_data['username'] ?? ''); ?>" 
                               readonly>
                    </div>

                    <!-- الاسم الكامل - للقراءة فقط -->
                    <div class="form-group">
                        <label for="full_name">Full Name</label>
                        <input type="text" 
                               name="full_name"
                               class="readonly-field" 
                               value="<?php echo htmlspecialchars($user_data['full_name'] ?? ''); ?>" 
                               readonly>
                    </div>

                    <!-- البريد الإلكتروني - للقراءة فقط -->
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" 
                               name="email"
                               class="readonly-field" 
                               value="<?php echo htmlspecialchars($user_data['email'] ?? ''); ?>" 
                               readonly>
                    </div>

                    <!-- العمر - يمكن تعديله -->
                    <div class="form-group">
                        <label for="age">Age</label>
                        <input type="number" 
                               id="age" 
                               name="age" 
                               min="16" 
                               max="100" 
                               value="<?php echo htmlspecialchars($user_data['age'] ?? ''); ?>">
                    </div>

                    <!-- الدور - للقراءة فقط -->
                    <div class="form-group">
                        <label for="role">Role</label>
                        <input type="text" 
                               class="readonly-field" 
                               value="<?php 
                                    if ($user_data['role'] === 'sub_leader') {
                                        echo 'Sub Leader';
                                    } else if ($user_data['role'] === 'project_leader') {
                                        echo 'Project Leader';
                                    } else if ($user_data['role'] === 'team_leader') {
                                        echo 'Team Leader';
                                    } else {
                                        echo htmlspecialchars($user_data['role'] ?? '');
                                    }
                               ?>" 
                               readonly>
                    </div>

                    <!-- الحالة - للقراءة فقط -->
                    <div class="form-group">
                        <label for="status">Status</label>
                        <input type="text" id="status" value="<?php echo htmlspecialchars($user_data['status']); ?>" readonly class="readonly-field">
                    </div>
                </div>

                <!-- معلومات الفريق -->
                <div class="form-section">
                    <h3 class="section-title">
                        <i class="fas fa-users"></i>
                        Team Information
                    </h3>
                    
                    <!-- عرض الفريق - للقراءة فقط -->
                    <div class="form-group">
                        <label for="team">Team</label>
                        <input type="text" 
                               class="readonly-field" 
                               value="<?php 
                                   $team_names = [
                                       'mechanical' => 'Mechanical Engineering Team',
                                       'electrical' => 'Electrical Engineering Team',
                                       'operating_business' => 'Business Operating Team'
                                   ];
                                   echo htmlspecialchars($team_names[$user_data['team']] ?? $user_data['team']); 
                               ?>" 
                               readonly>
                    </div>

                    <!-- عرض القسم - للقراءة فقط -->
                    <div class="form-group">
                        <label for="department">Department</label>
                        <input type="text" id="department" name="department" value="<?php 
                            $dept_names = [
                                // Business Operations Team departments
                                'marketing' => 'Marketing',
                                'sponsorships' => 'Sponsorships',
                                'management' => 'Management',
                                
                                // Mechanical Team departments
                                'chassis_aero' => 'Chassis and Aerodynamics',
                                'suspension_steering' => 'Suspension and Steering',
                                'transmission_braking' => 'Transmission and Braking',

                                // Electrical Team departments
                                'high_voltage' => 'High Voltage',
                                'low_voltage' => 'Low Voltage',
                                
                                // Team values
                                'bot' => 'Business Operations Team',
                                'mechanical' => 'Mechanical Team',
                                'electrical' => 'Electrical Team'
                            ];
                            echo isset($dept_names[$user_data['department']]) ? $dept_names[$user_data['department']] : $user_data['department'];
                        ?>" readonly>
                    </div>

                    <!-- باقي الحقول كما هي -->
                    <div class="form-group">
                        <label for="position">Position</label>
                        <input type="text" 
                               class="readonly-field" 
                               value="<?php echo htmlspecialchars($user_data['position'] ?? ''); ?>" 
                               readonly>
                    </div>

                    <!-- باقي الحقول القابلة للتعديل -->
                    <div class="form-group">
                        <label for="motivation">Motivation</label>
                        <textarea id="motivation" name="motivation"><?php echo htmlspecialchars($user_data['motivation'] ?? ''); ?></textarea>
                    </div>

                    <div class="form-group">
                        <label for="skills">Skills</label>
                        <textarea id="skills" name="skills"><?php echo htmlspecialchars($user_data['skills'] ?? ''); ?></textarea>
                    </div>

                    <div class="form-group">
                        <label for="projects">Projects</label>
                        <textarea id="projects" name="projects"><?php echo htmlspecialchars($user_data['projects'] ?? ''); ?></textarea>
                    </div>

                    <div class="form-group">
                        <label for="achievements">Achievements</label>
                        <textarea id="achievements" name="achievements"><?php echo htmlspecialchars($user_data['achievements'] ?? ''); ?></textarea>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn primary">Save Changes</button>
                <a href="team_dashboard.php" class="btn secondary">Cancel</a>
            </div>
        </form>
    </div>

    <script>
        function previewImage(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('profilePicture').src = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        // إظهار رسالة النجاح
        <?php if ($success_message): ?>
            setTimeout(() => {
                const successAlert = document.querySelector('.alert.success');
                if (successAlert) {
                    successAlert.style.display = 'none';
                }
            }, 3000);
        <?php endif; ?>
    </script>
</body>
</html> 