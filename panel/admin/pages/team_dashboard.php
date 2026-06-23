<?php
require_once '../auth.php';
$user = checkAuth(['team_member', 'team_leader', 'sub_leader', 'project_leader']);

require_once __DIR__ . '/../../../backend/config/database.php';
$success_message = '';
$error_message = '';

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Get user information
    $user_stmt = $conn->prepare("
        SELECT u.*, tm.team 
        FROM users u 
        LEFT JOIN team_members tm ON u.id = tm.user_id 
        WHERE u.id = ?
    ");
    $user_stmt->bind_param("i", $_SESSION['user_id']);
    $user_stmt->execute();
    $user_data = $user_stmt->get_result()->fetch_assoc();

    // تحديث بيانات الجلسة
    $_SESSION['full_name'] = $user_data['full_name'];
    $_SESSION['team'] = $user_data['team'];

    // Get team member's reports count
    $reports_stmt = $conn->prepare("SELECT COUNT(*) as reports_count FROM team_reports WHERE user_id = ?");
    $reports_stmt->bind_param("i", $_SESSION['user_id']);
    $reports_stmt->execute();
    $reports_count = $reports_stmt->get_result()->fetch_assoc()['reports_count'];

    // جلب معلومات أعضاء الفريق بناءً على الدور
    if ($_SESSION['role'] === 'project_leader' || $_SESSION['role'] === 'team_leader') {
        // القادة يرون جميع أعضاء كل الفرق
        $team_members_stmt = $conn->prepare("
            SELECT 
                u.id,
                u.username,
                u.full_name,
                u.email,
                u.role,
                u.team,
                u.department,
                CASE 
                    WHEN u.role = 'sub_leader' THEN 'Sub Leader'
                    WHEN u.role = 'project_leader' THEN 'Project Leader'
                    WHEN u.role = 'team_leader' THEN 'Team Leader'
                    ELSE tm.position
                END as position,
                tm.profile_picture
            FROM users u
            LEFT JOIN team_members tm ON u.id = tm.user_id
            WHERE u.status = 'active' AND u.role IN ('team_member', 'sub_leader', 'team_leader', 'project_leader')
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
        ");
        $team_members_stmt->execute();
    } else {
        // باقي الأعضاء يرون جميع أعضاء فريقهم (كل الأقسام)
        $team_members_stmt = $conn->prepare("
            SELECT 
                u.id,
                u.username,
                u.full_name,
                u.email,
                u.role,
                u.team,
                u.department,
                CASE 
                    WHEN u.role = 'sub_leader' THEN 'Sub Leader'
                    WHEN u.role = 'project_leader' THEN 'Project Leader'
                    WHEN u.role = 'team_leader' THEN 'Team Leader'
                    WHEN tm.position IS NOT NULL AND tm.position != '' THEN tm.position
                    ELSE 'Team Member'
                END as position,
                tm.profile_picture
            FROM users u
            LEFT JOIN team_members tm ON u.id = tm.user_id
            WHERE u.status = 'active' AND (
                u.team = ?
                OR u.role IN ('project_leader', 'team_leader')
            )
            ORDER BY 
                CASE 
                    WHEN u.role = 'project_leader' THEN 0
                    WHEN u.role = 'team_leader' THEN 1
                    WHEN u.role = 'sub_leader' THEN 2
                    ELSE 4
                END,
                u.department,
                u.full_name
        ");
        $team_members_stmt->bind_param("s", $_SESSION['team']);
        $team_members_stmt->execute();
    }

    $team_members_result = $team_members_stmt->get_result();
    while ($member = $team_members_result->fetch_assoc()) {
        $team_members[] = $member;
    }

    // جلب أحدث التقارير بناءً على الدور
    if ($_SESSION['role'] === 'project_leader' || $_SESSION['role'] === 'team_leader') {
        // القادة يرون تقارير من جميع الفرق
        $team_reports_stmt = $conn->prepare("
            SELECT r.*, u.username, u.full_name 
            FROM team_reports r 
            JOIN users u ON r.user_id = u.id 
            ORDER BY r.created_at DESC 
            LIMIT 10
        ");
        $team_reports_stmt->execute();
    } else {
        // باقي الأعضاء يرون تقارير فريقهم فقط
        $team_reports_stmt = $conn->prepare("
            SELECT r.*, u.username, u.full_name 
            FROM team_reports r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.team = ? 
            ORDER BY r.created_at DESC 
            LIMIT 5
        ");
        $team_reports_stmt->bind_param("s", $_SESSION['team']);
        $team_reports_stmt->execute();
    }
    $team_reports = $team_reports_stmt->get_result();

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
    <title>Team Member Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/dashboard.css">
    <link rel="stylesheet" href="../css/team_dashboard.css">
    <link rel="stylesheet" href="../../assets/css/teams.css">
    <style>
        /* أنماط لبطاقات القيادة */
        .project-leader-card {
            border: 2px solid #8A2BE2 !important;
            box-shadow: 0 5px 15px rgba(138, 43, 226, 0.2) !important;
        }
        
        .team-leader-card {
            border: 2px solid #1E90FF !important;
            box-shadow: 0 5px 15px rgba(30, 144, 255, 0.2) !important;
        }
        
        .project-leader-card .card-front {
            background: linear-gradient(to right, rgba(138, 43, 226, 0.2), transparent);
        }
        
        .team-leader-card .card-front {
            background: linear-gradient(to right, rgba(30, 144, 255, 0.2), transparent);
        }
        
        /* أنماط لعناوين الفرق */
        .team-section-heading {
            grid-column: 1 / -1;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #FFB300;
            font-size: 1.3rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(255, 179, 0, 0.3);
        }
        
        /* تنسيق عرض الفرق */
        .reports-list .report-team {
            color: #FFB300;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }
        
        /* تنسيق العناوين الجديدة */
        .team-info-header {
            text-align: center;
            margin-bottom: 2rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            border-bottom: 2px solid #FFB300;
        }
        
        .team-name {
            color: #FFB300;
            font-size: 1.8rem;
            margin-bottom: 0.5rem;
            font-family: 'Michroma',sans-serif;
            text-transform: uppercase;
        }
        
        .department-name {
            color: #fff;
            font-size: 1.4rem;
            opacity: 0.8;
            font-family: 'Rajdhani', sans-serif;
        }
        
        /* تنسيق عنوان الأعضاء */
        .members-heading {
            color: #aaa;
            font-size: 1.2rem;
            margin: 2rem 0 1rem;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* تنسيق حاوية Sub Leader */
        .sub-leader-container {
            display: flex;
            justify-content: center;
            margin: 2rem auto;
            position: relative;
        }
        
        .sub-leader-container::after {
            content: '';
            position: absolute;
            bottom: -1rem;
            left: 50%;
            transform: translateX(-50%);
            width: 50%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #FFD700, transparent);
        }
        
        .sub-leader-card {
            transform: scale(1.05);
            border: 2px solid #FFD700 !important;
            box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3) !important;
        }
        
        .sub-leader-card .position {
            color: #FFD700 !important;
            font-weight: bold;
        }
        
        /* تنسيق رسائل الحالة الفارغة */
        .no-regular-members {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            margin-top: 1rem;
            color: #aaa;
        }
        
        /* تحسين تنسيق بطاقات التقارير */
        .report-card {
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .report-preview {
            margin-bottom: 15px;
        }
        
        /* تنسيق زر Read More */
        .read-more-btn {
            display: inline-block;
            background: linear-gradient(135deg, #FFB300, #FF9500);
            color: #000;
            padding: 8px 16px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 500;
            margin-top: 12px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(255, 179, 0, 0.3);
            text-align: center;
        }
        
        .read-more-btn:hover {
            background: linear-gradient(135deg, #FF9500, #FFB300);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 179, 0, 0.5);
        }
        
        .read-more-btn i {
            margin-right: 6px;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- Header -->
        <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

        <!-- Main Content -->
        <div class="dashboard-content">
            <!-- Welcome Section -->
            <div class="welcome-section">
                <h2>Welcome, <?php echo htmlspecialchars($user_data['full_name']); ?>!</h2>
                <?php if ($_SESSION['role'] === 'project_leader'): ?>
                <p>Role: Project Leader</p>
                <?php elseif ($_SESSION['role'] === 'team_leader'): ?>
                <p>Role: Team Leader</p>
                <?php else: ?>
                <p>Team: <?php 
                    $team_names = [
                        'mechanical' => 'Mechanical Engineering',
                        'electrical' => 'Electrical Engineering',
                        'operating_business' => 'Business Operating Team'
                    ];
                    echo htmlspecialchars($team_names[$user_data['team']] ?? $user_data['team']); 
                ?></p>
                <p>Role: <?php echo ucfirst(str_replace('_', ' ', $_SESSION['role'])); ?></p>
                <?php endif; ?>
            </div>

            <?php if ($error_message): ?>
                <div class="error-message">
                    <?php echo htmlspecialchars($error_message); ?>
                </div>
            <?php endif; ?>

            <!-- Quick Stats -->
            <div class="stats-container">
                <div class="stat-card">
                    <i class="fas fa-file-alt"></i>
                    <div class="stat-info">
                        <h3>Your Reports</h3>
                        <p><?php echo $reports_count; ?></p>
                    </div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-users"></i>
                    <div class="stat-info">
                        <h3>Team Members</h3>
                        <p><?php echo count($team_members); ?></p>
                    </div>
                </div>
            </div>

            <!-- Team Members Section -->
            <div class="team-members-section">
                <h2>
                    <?php if ($_SESSION['role'] === 'project_leader' || $_SESSION['role'] === 'team_leader'): ?>
                        All Team Members
                    <?php else: ?>
                        Your Team
                    <?php endif; ?>
                </h2>
                
                <div class="members-container">
                    <?php if (!empty($team_members)): ?>
                        <?php if ($_SESSION['role'] === 'project_leader' || $_SESSION['role'] === 'team_leader'): ?>
                            <?php
                            // تنظيم الأعضاء حسب الفريق
                            $members_by_team = [
                                'leadership' => [],
                                'mechanical' => [],
                                'electrical' => [],
                                'operating_business' => []
                            ];
                            
                            // تصنيف الأعضاء حسب الفريق
                            foreach ($team_members as $member) {
                                if ($member['role'] === 'project_leader' || $member['role'] === 'team_leader') {
                                    $members_by_team['leadership'][] = $member;
                                } elseif (array_key_exists($member['team'], $members_by_team)) {
                                    $members_by_team[$member['team']][] = $member;
                                }
                            }
                            
                            // تعريف أسماء الفرق للعرض
                            $team_display_names = [
                                'leadership' => 'Leadership',
                                'mechanical' => 'Mechanical Engineering',
                                'electrical' => 'Electrical Engineering',
                                'operating_business' => 'Business Operating Team'
                            ];
                            
                            // عرض الأعضاء مرتبين حسب الفريق
                            foreach ($members_by_team as $team_key => $team_members_list):
                                if (empty($team_members_list)) continue;
                            ?>
                                <h3 class="team-section-heading"><?php echo $team_display_names[$team_key]; ?></h3>
                                <div class="members-row">
                                    <?php foreach ($team_members_list as $member): ?>
                                        <div class="member-card 
                                            <?php 
                                                if ($member['role'] === 'sub_leader') {
                                                    echo 'sub-leader-card';
                                                } elseif ($member['role'] === 'project_leader') {
                                                    echo 'project-leader-card';
                                                } elseif ($member['role'] === 'team_leader') {
                                                    echo 'team-leader-card';
                                                }
                                            ?>">
                                            <div class="card-inner">
                                                <div class="card-front">
                                                    <div class="member-image">
                                                        <img src="<?php echo $member['profile_picture'] && $member['profile_picture'] !== 'default.jpg' ? '../uploads/profiles/' . htmlspecialchars($member['profile_picture']) : '../assets/images/W logo.png'; ?>" 
                                                             alt="<?php echo htmlspecialchars($member['full_name']); ?>"
                                                             loading="lazy"
                                                             onerror="this.src='../assets/images/W logo.png'">
                                                    </div>
                                                    <div class="member-info">
                                                        <h3><?php echo htmlspecialchars($member['full_name']); ?></h3>
                                                        <p class="position"><?php echo htmlspecialchars($member['position'] ?: 'Team Member'); ?></p>
                                                        <?php if (!empty($member['department']) && $team_key !== 'leadership'): ?>
                                                        <p class="department">
                                                            <?php 
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
                                                                echo htmlspecialchars($dept_names[$member['department']] ?? $member['department']); 
                                                            ?>
                                                        </p>
                                                        <?php endif; ?>
                                                    </div>
                                                </div>
                                                <div class="card-back">
                                                    <div class="info-item">
                                                        <div class="info-label">Email</div>
                                                        <div class="info-value"><?php echo htmlspecialchars($member['email']); ?></div>
                                                    </div>
                                                    <div class="info-item">
                                                        <div class="info-label">Position</div>
                                                        <div class="info-value"><?php echo htmlspecialchars($member['position'] ?: 'Team Member'); ?></div>
                                                    </div>
                                                    <?php if (!empty($member['department'])): ?>
                                                    <div class="info-item">
                                                        <div class="info-label">Department</div>
                                                        <div class="info-value">
                                                            <?php echo htmlspecialchars($dept_names[$member['department']] ?? $member['department']); ?>
                                                        </div>
                                                    </div>
                                                    <?php endif; ?>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            <?php endforeach; ?>
                        <?php else: ?>
                        <!-- عرض الأعضاء للـ team members العاديين - منظمين حسب القسم -->
                        <?php
                        // تنظيم الأعضاء حسب القسم
                        $members_by_dept = [];
                        
                        foreach ($team_members as $member) {
                            // تجاهل القيادة العليا (سيتم عرضها تلقائياً في الأعلى)
                            if ($member['role'] === 'project_leader' || $member['role'] === 'team_leader') {
                                continue;
                            }
                            
                            $dept = $member['department'] ?? 'unknown';
                            if (!isset($members_by_dept[$dept])) {
                                $members_by_dept[$dept] = [];
                            }
                            $members_by_dept[$dept][] = $member;
                        }
                        
                        // عرض معلومات الفريق
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
                        
                        $team_names = [
                            'mechanical' => 'Mechanical Engineering',
                            'electrical' => 'Electrical Engineering',
                            'operating_business' => 'Business Operating Team'
                        ];
                        
                        $team_name = $team_names[$user_data['team']] ?? $user_data['team'];
                        ?>
                        
                        <div class="team-info-header">
                            <h3 class="team-name"><?php echo htmlspecialchars($team_name); ?></h3>
                        </div>
                        
                        <?php foreach ($members_by_dept as $dept => $dept_members): ?>
                            <?php
                            $department_name = $dept_names[$dept] ?? ucfirst(str_replace('_', ' ', $dept));
                            // فصل Sub Leader عن باقي الأعضاء
                            $sub_leader = null;
                            $regular_members = [];
                            
                            foreach ($dept_members as $member) {
                                if ($member['role'] === 'sub_leader') {
                                    $sub_leader = $member;
                                } else {
                                    $regular_members[] = $member;
                                }
                            }
                            ?>
                            
                            <h3 class="team-section-heading"><?php echo htmlspecialchars($department_name); ?></h3>
                            
                            <?php if ($sub_leader): ?>
                            <!-- عرض Sub Leader -->
                            <div class="sub-leader-container">
                                <div class="member-card sub-leader-card">
                                    <div class="card-inner">
                                        <div class="card-front">
                                            <div class="member-image">
                                                <img src="<?php echo $sub_leader['profile_picture'] && $sub_leader['profile_picture'] !== 'default.jpg' ? '../uploads/profiles/' . htmlspecialchars($sub_leader['profile_picture']) : '../assets/images/W logo.png'; ?>" 
                                                     alt="<?php echo htmlspecialchars($sub_leader['full_name']); ?>"
                                                     loading="lazy"
                                                     onerror="this.src='../assets/images/W logo.png'">
                                            </div>
                                            <div class="member-info">
                                                <h3><?php echo htmlspecialchars($sub_leader['full_name']); ?></h3>
                                                <p class="position"><?php echo htmlspecialchars($sub_leader['position'] ?: 'Sub Leader'); ?></p>
                                                <p class="department"><?php echo htmlspecialchars($department_name); ?></p>
                                            </div>
                                        </div>
                                        <div class="card-back">
                                            <div class="info-item">
                                                <div class="info-label">Email</div>
                                                <div class="info-value"><?php echo htmlspecialchars($sub_leader['email']); ?></div>
                                            </div>
                                            <div class="info-item">
                                                <div class="info-label">Position</div>
                                                <div class="info-value"><?php echo htmlspecialchars($sub_leader['position'] ?: 'Sub Leader'); ?></div>
                                            </div>
                                            <div class="info-item">
                                                <div class="info-label">Department</div>
                                                <div class="info-value"><?php echo htmlspecialchars($department_name); ?></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <?php endif; ?>
                            
                            <?php if (!empty($regular_members)): ?>
                            <!-- عرض الأعضاء العاديين -->
                            <div class="members-row">
                                <?php foreach ($regular_members as $member): ?>
                                    <div class="member-card">
                                        <div class="card-inner">
                                            <div class="card-front">
                                                <div class="member-image">
                                                    <img src="<?php echo $member['profile_picture'] && $member['profile_picture'] !== 'default.jpg' ? '../uploads/profiles/' . htmlspecialchars($member['profile_picture']) : '../assets/images/W logo.png'; ?>" 
                                                         alt="<?php echo htmlspecialchars($member['full_name']); ?>"
                                                         loading="lazy"
                                                         onerror="this.src='../assets/images/W logo.png'">
                                                </div>
                                                <div class="member-info">
                                                    <h3><?php echo htmlspecialchars($member['full_name']); ?></h3>
                                                    <p class="position"><?php echo htmlspecialchars($member['position'] ?: 'Team Member'); ?></p>
                                                    <p class="department"><?php echo htmlspecialchars($department_name); ?></p>
                                                </div>
                                            </div>
                                            <div class="card-back">
                                                <div class="info-item">
                                                    <div class="info-label">Email</div>
                                                    <div class="info-value"><?php echo htmlspecialchars($member['email']); ?></div>
                                                </div>
                                                <div class="info-item">
                                                    <div class="info-label">Position</div>
                                                    <div class="info-value"><?php echo htmlspecialchars($member['position'] ?: 'Team Member'); ?></div>
                                                </div>
                                                <div class="info-item">
                                                    <div class="info-label">Department</div>
                                                    <div class="info-value"><?php echo htmlspecialchars($department_name); ?></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                            <?php endif; ?>
                        <?php endforeach; ?>
                        <?php endif; ?>
                    <?php else: ?>
                        <div class="no-members">
                            <p>No team members found.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <h2>Quick Actions</h2>
                <div class="actions-grid">
                    <a href="add_report.php" class="action-btn">
                        <i class="fas fa-plus"></i>
                        Add New Report
                    </a>
                    <a href="reports.php" class="action-btn">
                        <i class="fas fa-file-alt"></i>
                        View Team Reports
                    </a>
                    <a href="edit_profile.php" class="action-btn">
                        <i class="fas fa-user-edit"></i>
                        Edit Profile
                    </a>
                </div>
            </div>

            <!-- Latest Team Reports -->
            <div class="latest-reports">
                <h2>
                    <?php if ($_SESSION['role'] === 'project_leader' || $_SESSION['role'] === 'team_leader'): ?>
                        Latest Reports From All Teams
                    <?php else: ?>
                        Latest Team Reports
                    <?php endif; ?>
                </h2>
                <div class="reports-list">
                    <?php if ($team_reports && $team_reports->num_rows > 0): ?>
                        <?php while ($report = $team_reports->fetch_assoc()): ?>
                            <div class="report-card">
                                <div class="report-header">
                                    <h3><?php echo htmlspecialchars($report['title']); ?></h3>
                                    <span class="report-date">
                                        <?php echo date('F j, Y', strtotime($report['created_at'])); ?>
                                    </span>
                                </div>
                                <p class="report-author">By: <?php echo htmlspecialchars($report['full_name']); ?></p>
                                <?php if ($_SESSION['role'] === 'project_leader' || $_SESSION['role'] === 'team_leader'): ?>
                                <p class="report-team">
                                    Team: <?php 
                                        $team_names = [
                                            'mechanical' => 'Mechanical Engineering',
                                            'electrical' => 'Electrical Engineering',
                                            'operating_business' => 'Business Operating Team'
                                        ];
                                        echo htmlspecialchars($team_names[$report['team']] ?? $report['team']); 
                                    ?>
                                </p>
                                <?php endif; ?>
                                <div class="report-preview">
                                    <?php 
                                    $content = htmlspecialchars($report['content']);
                                    echo strlen($content) > 150 ? substr($content, 0, 150) . '...' : $content;
                                    ?>
                                </div>
                                <a href="view_report.php?id=<?php echo $report['id']; ?>" class="read-more-btn">
                                    <i class="fas fa-book-open"></i> Read Full Report
                                </a>
                            </div>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <p class="no-reports">No reports found.</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <?php
    // Close database connections
    if (isset($user_stmt)) $user_stmt->close();
    if (isset($reports_stmt)) $reports_stmt->close();
    if (isset($team_reports_stmt)) $team_reports_stmt->close();
    if (isset($team_members_stmt)) $team_members_stmt->close();
    if (isset($conn)) $conn->close();
    ?>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // إضافة تأثير قلب البطاقة عند النقر
        const memberCards = document.querySelectorAll('.member-card');
        memberCards.forEach(card => {
            card.addEventListener('click', function() {
                const cardInner = this.querySelector('.card-inner');
                if (cardInner.style.transform === 'rotateY(180deg)') {
                    cardInner.style.transform = 'rotateY(0deg)';
                } else {
                    cardInner.style.transform = 'rotateY(180deg)';
                }
            });
        });
    });
    </script>
</body>
</html>