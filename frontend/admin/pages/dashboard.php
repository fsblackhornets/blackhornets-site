<?php
require_once '../auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../../../backend/config/database.php';

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Get statistics
    $pending_applications = $conn->query("SELECT COUNT(*) as count FROM applications WHERE status = 'pending'")->fetch_assoc()['count'];
    $new_messages = $conn->query("SELECT COUNT(*) as count FROM contact_messages")->fetch_assoc()['count'];
    $total_applications = $conn->query("SELECT COUNT(*) as count FROM applications")->fetch_assoc()['count'];
    
    // استعلام لحساب عدد الأعضاء في كل فريق
    $team_stats = $conn->prepare("
        SELECT 
            team,
            COUNT(*) as count
        FROM users 
        WHERE status = 'active' 
        AND role != 'admin'
        GROUP BY team
    ");
    
    $team_stats->execute();
    $result = $team_stats->get_result();
    
    // تهيئة المتغيرات
    $mechanical_members = 0;
    $electrical_members = 0;
    $business_members = 0;
    $total_members = 0;
    
    // تعيين القيم من نتيجة الاستعلام
    while ($row = $result->fetch_assoc()) {
        $total_members += $row['count'];
        switch ($row['team']) {
            case 'mechanical':
                $mechanical_members = $row['count'];
                break;
            case 'electrical':
                $electrical_members = $row['count'];
                break;
            case 'operating_business':
                $business_members = $row['count'];
                break;
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
    <title>Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../assets/css/dashboard.css">
</head>
<body>
    <div class="dashboard-container">
        <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

        <div class="cards-container">
            <a href="applications_list.php" class="card">
                <i class="fas fa-users icon"></i>
                <h3 data-i18n="pendingApplications">Pending Applications</h3>
                <p><?php echo $pending_applications; ?></p>
                <span class="subtitle" data-i18n="awaitingReview">Awaiting Review</span>
            </a>

            <a href="messages.php" class="card">
                <i class="fas fa-envelope icon"></i>
                <h3 data-i18n="newMessages">New Messages</h3>
                <p><?php echo $new_messages; ?></p>
                <span class="subtitle" data-i18n="unreadMessages">Unread Messages</span>
            </a>

            <a href="applications_list.php" class="card">
                <i class="fas fa-chart-line icon"></i>
                <h3 data-i18n="totalApplications">Total Applications</h3>
                <p><?php echo $total_applications; ?></p>
                <span class="subtitle" data-i18n="allTime">All Time</span>
            </a>

            <a href="manage_members.php" class="card">
                <i class="fas fa-users-gear icon"></i>
                <h3 data-i18n="teamMembers">Team Members</h3>
                <div class="team-stats">
                    <span><span data-i18n="mechanical">Mechanical</span>: <?php echo $mechanical_members; ?></span>
                    <span><span data-i18n="electrical">Electrical</span>: <?php echo $electrical_members; ?></span>
                    <span><span data-i18n="business">Business</span>: <?php echo $business_members; ?></span>
                </div>
                <span class="subtitle"><span data-i18n="totalMembers">Total Members</span>: <?php echo $total_members; ?></span>
            </a>
        </div>

        <div class="quick-actions">
            <h2 data-i18n="quickActions">Quick Actions</h2>
            <div class="cards-grid">
                <a href="add_user.php" class="card">
                    <i class="fas fa-user-plus icon"></i>
                    <h3 data-i18n="addNewUser">Add New User</h3>
                    <p data-i18n="createNewTeamMember">Create new team member account</p>
                </a>

                <a href="add-edit-post.php" class="card add-post-card">
                    <i class="fas fa-newspaper icon"></i>
                    <h3 data-i18n="addNewsBlogPost">Add News / Blog Post</h3>
                    <p data-i18n="createPublishNews">Create and publish a new news or blog article for your website audience.</p>
                </a>

                <a href="manage-gallery.php" class="card gallery-card">
                    <i class="fas fa-images icon"></i>
                    <h3 data-i18n="manageGallery">Manage Gallery</h3>
                    <p data-i18n="uploadManageImages">Upload and manage images for the website gallery</p>
                </a>

                <a href="manage-sponsors.php" class="card sponsors-card">
                    <i class="fas fa-handshake icon"></i>
                    <h3 data-i18n="manageSponsors">Manage Sponsors</h3>
                    <p data-i18n="addEditDeleteSponsors">Add, edit, and delete sponsors for the website</p>
                </a>

                <a href="manage-projects.php" class="card projects-card">
                    <i class="fas fa-project-diagram icon"></i>
                    <h3 data-i18n="manageProjects">Manage Projects</h3>
                    <p data-i18n="addEditDeleteProjects">Add, edit, and delete projects for the website</p>
                </a>

                <a href="manage_members.php" class="card">
                    <i class="fas fa-users-cog icon"></i>
                    <h3 data-i18n="manageMembers">Manage Members</h3>
                    <p data-i18n="viewManageMembers">View and manage all team members</p>
                </a>

                <a href="manage-sponsors.php#brochure-section" class="card brochure-card">
                    <i class="fas fa-file-pdf icon"></i>
                    <h3 data-i18n="partnerBrochure">Partner Brochure</h3>
                    <p data-i18n="uploadManageBrochures">Upload and manage partner brochures</p>
                </a>
            </div>
        </div>
    </div>

    <div class="loading-overlay">
        <div class="loading-spinner"></div>
    </div>

    <script>
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href) {
                    document.querySelector('.loading-overlay').style.display = 'flex';
                    window.location.href = href;
                }
            });
        });

        window.addEventListener('load', function() {
            document.querySelector('.loading-overlay').style.display = 'none';
        });

        window.addEventListener('error', function() {
            document.querySelector('.loading-overlay').style.display = 'none';
            alert('حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.');
        });
    </script>
</body>
</html>

<?php
if (isset($conn)) {
    $conn->close();
}
?>