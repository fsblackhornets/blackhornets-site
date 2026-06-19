<?php
require_once '../auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../../../backend/config/database.php';
require_once __DIR__ . '/../../../backend/helpers/csrf_helper.php';

$error_message = '';
$success_message = '';
$members = [];

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Handle disable/enable action
    if (isset($_GET['action']) && $_GET['action'] === 'toggle_status' && isset($_GET['id'])) {
        csrf_check();
        $member_id = (int)$_GET['id'];
        // Don't allow toggling your own account
        if ($member_id === (int)$_SESSION['user_id']) {
            $error_message = "You cannot disable your own account.";
        } else {
            $stmt = $conn->prepare("UPDATE users SET status = IF(status='active','inactive','active') WHERE id = ? AND role != 'admin'");
            $stmt->bind_param("i", $member_id);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $success_message = "Member status updated successfully.";
            }
            $stmt->close();
            // Redirect to remove query params
            header("Location: manage_members.php?msg=status_updated");
            exit;
        }
    }

    // Handle delete action
    if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
        csrf_check();
        $member_id = (int)$_GET['id'];
        if ($member_id === (int)$_SESSION['user_id']) {
            $error_message = "You cannot delete your own account.";
        } else {
            // Delete profile picture file if exists
            $pic_stmt = $conn->prepare("SELECT profile_picture FROM team_members WHERE user_id = ?");
            $pic_stmt->bind_param("i", $member_id);
            $pic_stmt->execute();
            $pic_result = $pic_stmt->get_result();
            if ($pic_row = $pic_result->fetch_assoc()) {
                if (!empty($pic_row['profile_picture']) && $pic_row['profile_picture'] !== 'default.jpg') {
                    $pic_path = __DIR__ . '/../../uploads/profiles/' . basename($pic_row['profile_picture']);
                    if (file_exists($pic_path)) {
                        unlink($pic_path);
                    }
                }
            }
            $pic_stmt->close();

            // Delete user (cascades to team_members via FK)
            $stmt = $conn->prepare("DELETE FROM users WHERE id = ? AND role != 'admin'");
            $stmt->bind_param("i", $member_id);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                // Also clean up member_roles
                $roles_stmt = $conn->prepare("DELETE FROM member_roles WHERE user_id = ?");
                $roles_stmt->bind_param("i", $member_id);
                $roles_stmt->execute();
                $roles_stmt->close();
                $success_message = "Member deleted successfully.";
            }
            $stmt->close();
            header("Location: manage_members.php?msg=deleted");
            exit;
        }
    }

    // Handle redirect messages
    if (isset($_GET['msg'])) {
        if ($_GET['msg'] === 'status_updated') $success_message = "Member status updated successfully.";
        if ($_GET['msg'] === 'deleted') $success_message = "Member deleted successfully.";
    }

    // تحديث استعلام جلب الأعضاء
    $query = "
        SELECT 
            u.id,
            u.username,
            u.email,
            u.full_name,
            u.role,
            u.team,
            u.department,
            u.status,
            CASE 
                WHEN u.role = 'sub_leader' THEN 'Sub Leader'
                WHEN u.role = 'project_leader' THEN 'Project Leader'
                WHEN u.role = 'team_leader' THEN 'Team Leader'
                WHEN t.position IS NOT NULL AND t.position != '' THEN t.position
                ELSE 'Team Member'
            END as position,
            t.profile_picture
        FROM users u
        LEFT JOIN team_members t ON u.id = t.user_id
        WHERE u.role IN ('team_member', 'team_leader', 'sub_leader', 'project_leader')
          AND u.id != 1
        ORDER BY 
            CASE 
                WHEN u.role = 'project_leader' THEN 0
                WHEN u.role = 'team_leader' THEN 1
                WHEN u.role = 'sub_leader' THEN 2
                ELSE 3
            END,
            u.team,
            u.department, 
            u.full_name
    ";
    
    $result = $conn->query($query);
    while ($row = $result->fetch_assoc()) {
        $members[] = $row;
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
    <title>Manage Team Members - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../assets/css/dashboard.css">
    <link rel="stylesheet" href="../../assets/css/manage_members.css">
    <style>
        /* تنسيقات خاصة للـ sub leader */
        .sub-leader-badge {
            background-color: #FFD700;
            color: #000;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            display: inline-block;
        }
        
        .member-card.sub-leader {
            border: 2px solid #FFD700;
            box-shadow: 0 5px 15px rgba(255, 215, 0, 0.2);
        }
        
        .member-card.sub-leader .member-header {
            background: linear-gradient(to right, rgba(255, 215, 0, 0.2), transparent);
        }
        
        /* تنسيقات خاصة للـ project leader */
        .project-leader-badge {
            background-color: #8A2BE2; /* بنفسجي ملكي */
            color: #fff;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            display: inline-block;
        }
        
        .member-card.project-leader {
            border: 2px solid #8A2BE2;
            box-shadow: 0 5px 15px rgba(138, 43, 226, 0.2);
        }
        
        .member-card.project-leader .member-header {
            background: linear-gradient(to right, rgba(138, 43, 226, 0.2), transparent);
        }
        
        /* تنسيقات خاصة للـ team leader */
        .team-leader-badge {
            background-color: #1E90FF; /* أزرق */
            color: #fff;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            display: inline-block;
        }
        
        .member-card.team-leader {
            border: 2px solid #1E90FF;
            box-shadow: 0 5px 15px rgba(30, 144, 255, 0.2);
        }
        
        .member-card.team-leader .member-header {
            background: linear-gradient(to right, rgba(30, 144, 255, 0.2), transparent);
        }
        
        .members-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        
        .team-filter {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin-bottom: 1.5rem;
        }
        
        .department-heading {
            grid-column: 1 / -1;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            color: #FFB300;
            font-size: 1.5rem;
            border-bottom: 1px solid rgba(255, 179, 0, 0.3);
            padding-bottom: 0.5rem;
        }

        .members-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .add-member-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 22px;
            background: var(--primary-color);
            color: var(--dark-bg);
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .add-member-btn:hover {
            background: #ffed4a;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }

        /* Status indicators */
        .status-active {
            color: #4CAF50;
            font-size: 0.6rem;
        }
        .status-inactive {
            color: #f44336;
            font-size: 0.6rem;
        }

        /* Disable/Enable button */
        .toggle-status-btn {
            background-color: rgba(255, 152, 0, 0.15);
            border: 1px solid #FF9800;
            color: #FF9800;
        }
        .toggle-status-btn:hover {
            background-color: #FF9800;
            color: #fff;
        }

        /* Delete button */
        .delete-btn {
            background-color: rgba(244, 67, 54, 0.15);
            border: 1px solid #f44336;
            color: #f44336;
        }
        .delete-btn:hover {
            background-color: #f44336;
            color: #fff;
        }

        /* Inactive member card */
        .member-card.inactive-member {
            opacity: 0.6;
            border: 1px dashed rgba(244, 67, 54, 0.5);
        }

        /* Success alert */
        .alert-success {
            background: rgba(76, 175, 80, 0.15);
            border: 1px solid #4CAF50;
            color: #4CAF50;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.95rem;
        }

        .member-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
            flex-wrap: wrap;
        }

        .action-btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

        <div class="members-container">
            <div class="members-header">
                <div class="team-filter">
                    <button class="filter-btn active" data-team="all" data-i18n="allTeams">All Teams</button>
                    <button class="filter-btn" data-team="mechanical" data-i18n="mechanical">Mechanical</button>
                    <button class="filter-btn" data-team="electrical" data-i18n="electrical">Electrical</button>
                    <button class="filter-btn" data-team="operating_business" data-i18n="businessOperations">Business Operations</button>
                </div>
                <a href="add_user.php" class="add-member-btn">
                    <i class="fas fa-user-plus"></i> <span data-i18n="addNewUser">Add New User</span>
                </a>
            </div>

            <?php if ($success_message): ?>
                <div class="alert-success">
                    <i class="fas fa-check-circle"></i> <?php echo htmlspecialchars($success_message); ?>
                </div>
            <?php endif; ?>

            <?php if ($error_message): ?>
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i> <?php echo htmlspecialchars($error_message); ?>
                </div>
            <?php endif; ?>

            <div class="members-grid">
                <?php 
                $teams = [
                    'mechanical' => 'Mechanical Engineering',
                    'electrical' => 'Electrical Engineering',
                    'operating_business' => 'Business Operating Team'
                ];

                $team_i18n_keys = [
                    'mechanical' => 'mechanicalEngineering',
                    'electrical' => 'electricalEngineering',
                    'operating_business' => 'businessOperatingTeam'
                ];

                $dept_names = [
                    'chassis_aero' => 'Chassis and Aerodynamics',
                    'suspension_steering' => 'Suspension and Steering',
                    'transmission_braking' => 'Transmission and Braking',
                    'high_voltage' => 'High Voltage',
                    'low_voltage' => 'Low Voltage',
                    'marketing' => 'Marketing',
                    'sponsorships' => 'Sponsorships',
                    'management' => 'Management'
                ];

                $dept_i18n_keys = [
                    'chassis_aero' => 'deptChassisAero',
                    'suspension_steering' => 'deptSuspensionSteering',
                    'transmission_braking' => 'deptTransmissionBraking',
                    'high_voltage' => 'deptHighVoltage',
                    'low_voltage' => 'deptLowVoltage',
                    'marketing' => 'deptMarketing',
                    'sponsorships' => 'deptSponsorships',
                    'management' => 'deptManagement'
                ];
                
                // عرض project_leader و team_leader أولاً
                echo "<h2 class='department-heading team-all' data-team='all' data-i18n='leadership'>Leadership</h2>";
                
                foreach ($members as $member) {
                    if ($member['role'] === 'project_leader' || $member['role'] === 'team_leader') {
                        $isProjectLeader = $member['role'] === 'project_leader';
                        $isTeamLeader = $member['role'] === 'team_leader';
                        $isSubLeader = false;
                        $memberClass = $isProjectLeader ? 'member-card project-leader' : 'member-card team-leader';
                        if ($member['status'] === 'inactive') $memberClass .= ' inactive-member';
                        ?>
                        <div class="<?php echo $memberClass; ?>" data-team="all">
                            <div class="member-header">
                                <div class="member-avatar">
                                    <?php if ($member['profile_picture']): ?>
                                        <img src="../../uploads/profiles/<?php echo htmlspecialchars($member['profile_picture']); ?>" 
                                             alt="Profile Picture">
                                    <?php else: ?>
                                        <i class="fas fa-user-circle"></i>
                                    <?php endif; ?>
                                </div>
                                <div class="member-info">
                                    <h3><?php echo htmlspecialchars($member['full_name']); ?></h3>
                                    <?php if ($isProjectLeader): ?>
                                        <span class="project-leader-badge" data-i18n="projectLeader">Project Leader</span>
                                    <?php elseif ($isTeamLeader): ?>
                                        <span class="team-leader-badge" data-i18n="teamLeader">Team Leader</span>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <div class="member-details">
                                <p><i class="fas fa-envelope"></i> <?php echo htmlspecialchars($member['email']); ?></p>
                                <p>
                                    <i class="fas fa-circle <?php echo $member['status'] === 'active' ? 'status-active' : 'status-inactive'; ?>"></i>
                                    <?php echo $member['status'] === 'active' ? 'Active' : 'Inactive'; ?>
                                </p>
                            </div>

                            <div class="member-actions">
                                <a href="edit_member.php?id=<?php echo $member['id']; ?>"
                                   class="action-btn edit-member" data-i18n="edit">
                                    <i class="fas fa-edit"></i> Edit
                                </a>
                                <a href="manage_members.php?action=toggle_status&id=<?php echo $member['id']; ?>&csrf_token=<?php echo htmlspecialchars(csrf_generate_token()); ?>"
                                   class="action-btn toggle-status-btn"
                                   onclick="return confirm('Are you sure you want to <?php echo $member['status'] === 'active' ? 'disable' : 'enable'; ?> this member?');">
                                    <i class="fas fa-<?php echo $member['status'] === 'active' ? 'ban' : 'check-circle'; ?>"></i>
                                    <?php echo $member['status'] === 'active' ? 'Disable' : 'Enable'; ?>
                                </a>
                                <a href="manage_members.php?action=delete&id=<?php echo $member['id']; ?>&csrf_token=<?php echo htmlspecialchars(csrf_generate_token()); ?>"
                                   class="action-btn delete-btn"
                                   onclick="return confirm('WARNING: This will permanently delete this member and all their data. This cannot be undone. Continue?');">
                                    <i class="fas fa-trash"></i> Delete
                                </a>
                            </div>
                        </div>
                        <?php
                    }
                }
                
                // عرض بقية الأعضاء حسب الفريق
                $current_team = '';
                foreach ($members as $member): 
                    if ($member['role'] === 'project_leader' || $member['role'] === 'team_leader') {
                        continue; // تم عرضهم مسبقاً
                    }
                    
                    if ($member['team'] !== $current_team) {
                        $current_team = $member['team'];
                        $team_display = $teams[$current_team] ?? $current_team;
                        $team_i18n = $team_i18n_keys[$current_team] ?? '';
                        echo "<h2 class='department-heading team-{$current_team}' data-team='{$current_team}'" . ($team_i18n ? " data-i18n='{$team_i18n}'" : "") . ">{$team_display}</h2>";
                    }
                    
                    $isSubLeader = $member['role'] === 'sub_leader';
                    $isProjectLeader = false;
                    $isTeamLeader = false;
                    $memberClass = $isSubLeader ? 'member-card sub-leader' : 'member-card';
                    if ($member['status'] === 'inactive') $memberClass .= ' inactive-member';
                    $dept_display = $dept_names[$member['department']] ?? $member['department'];
                    $dept_i18n = $dept_i18n_keys[$member['department']] ?? '';
                ?>
                    <div class="<?php echo $memberClass; ?>" data-team="<?php echo htmlspecialchars($member['team']); ?>">
                        <div class="member-header">
                            <div class="member-avatar">
                                <?php if ($member['profile_picture']): ?>
                                    <img src="../../uploads/profiles/<?php echo htmlspecialchars($member['profile_picture']); ?>"
                                         alt="Profile Picture">
                                <?php else: ?>
                                    <i class="fas fa-user-circle"></i>
                                <?php endif; ?>
                            </div>
                            <div class="member-info">
                                <h3><?php echo htmlspecialchars($member['full_name']); ?></h3>
                                <?php if ($isSubLeader): ?>
                                    <span class="sub-leader-badge" data-i18n="subLeader">Sub Leader</span>
                                <?php endif; ?>
                                <?php if (!$isProjectLeader && !$isTeamLeader): ?>
                                <span class="department-badge"<?php echo $dept_i18n ? " data-i18n=\"{$dept_i18n}\"" : ''; ?>>
                                    <?php echo htmlspecialchars($dept_display); ?>
                                </span>
                                <?php endif; ?>
                            </div>
                        </div>

                        <div class="member-details">
                            <p><i class="fas fa-envelope"></i> <?php echo htmlspecialchars($member['email']); ?></p>
                            <?php if (!$isSubLeader && !$isProjectLeader && !$isTeamLeader && $member['position']): ?>
                                <p><i class="fas fa-briefcase"></i> <?php echo htmlspecialchars($member['position']); ?></p>
                            <?php endif; ?>
                            <p>
                                <i class="fas fa-circle <?php echo $member['status'] === 'active' ? 'status-active' : 'status-inactive'; ?>"></i>
                                <?php echo $member['status'] === 'active' ? 'Active' : 'Inactive'; ?>
                            </p>
                        </div>

                        <div class="member-actions">
                            <a href="edit_member.php?id=<?php echo $member['id']; ?>"
                               class="action-btn edit-member" data-i18n="edit">
                                <i class="fas fa-edit"></i> Edit
                            </a>
                            <a href="manage_members.php?action=toggle_status&id=<?php echo $member['id']; ?>&csrf_token=<?php echo htmlspecialchars(csrf_generate_token()); ?>"
                               class="action-btn toggle-status-btn"
                               onclick="return confirm('Are you sure you want to <?php echo $member['status'] === 'active' ? 'disable' : 'enable'; ?> this member?');">
                                <i class="fas fa-<?php echo $member['status'] === 'active' ? 'ban' : 'check-circle'; ?>"></i>
                                <?php echo $member['status'] === 'active' ? 'Disable' : 'Enable'; ?>
                            </a>
                            <a href="manage_members.php?action=delete&id=<?php echo $member['id']; ?>&csrf_token=<?php echo htmlspecialchars(csrf_generate_token()); ?>"
                               class="action-btn delete-btn"
                               onclick="return confirm('WARNING: This will permanently delete this member and all their data. This cannot be undone. Continue?');">
                                <i class="fas fa-trash"></i> Delete
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <script>
        // تحديث وظيفة الفلتر
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                // تحديث الزر النشط
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');

                // فلترة الأعضاء
                const team = button.dataset.team;
                
                // إظهار/إخفاء القادة
                const leadershipHeading = document.querySelector('.department-heading.team-all');
                const leadershipCards = document.querySelectorAll('.member-card[data-team="all"]');
                
                if (team === 'all') {
                    if (leadershipHeading) leadershipHeading.style.display = 'block';
                    leadershipCards.forEach(card => {
                        card.style.display = 'block';
                    });
                } else {
                    if (leadershipHeading) leadershipHeading.style.display = 'none';
                    leadershipCards.forEach(card => {
                        card.style.display = 'none';
                    });
                }
                
                // فلترة بقية الأعضاء
                document.querySelectorAll('.member-card:not([data-team="all"])').forEach(card => {
                    if (team === 'all' || card.dataset.team === team) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
                
                // فلترة عناوين الأقسام
                document.querySelectorAll('.department-heading:not(.team-all)').forEach(heading => {
                    if (team === 'all' || heading.dataset.team === team) {
                        heading.style.display = 'block';
                    } else {
                        heading.style.display = 'none';
                    }
                });
            });
        });
    </script>

    <?php
    if (isset($conn)) $conn->close();
    ?>
</body>
</html> 