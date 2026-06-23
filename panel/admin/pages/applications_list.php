<?php
require_once '../auth.php';
$user = checkAuth('admin');

// Database connection settings
require_once __DIR__ . '/../../../backend/config/database.php';

try {
    // Create database connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Set UTF-8 encoding
    $conn->set_charset("utf8mb4");

    // Get all applications
    $sql = "SELECT * FROM applications ORDER BY created_at DESC";
    $result = $conn->query($sql);

} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/frontend/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Applications Management - Black Hornets</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/dashboard.css">
    <link rel="stylesheet" href="../css/applications_list.css">
</head>
<body>
    <div class="dashboard-container">
        <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

        <div class="page-content">
            <div class="page-header">
                <h2 style="color: var(--primary-color); margin: 0;" data-i18n="applicationsManagement">Applications Management</h2>
                <div class="filters">
                    <button class="filter-btn active" data-filter="all" data-i18n="all">All</button>
                    <button class="filter-btn" data-filter="pending" data-i18n="pending">Pending</button>
                    <button class="filter-btn" data-filter="accepted" data-i18n="accepted">Accepted</button>
                    <button class="filter-btn" data-filter="rejected" data-i18n="rejected">Rejected</button>
                </div>
            </div>

            <div class="applications-grid">
                <?php while ($row = $result->fetch_assoc()): ?>
                    <div class="application-card" data-status="<?php echo $row['status']; ?>">
                        <div class="card-header">
                            <h3><?php echo htmlspecialchars($row['first_name'] . ' ' . $row['last_name']); ?></h3>
                            <span class="status-badge status-<?php echo $row['status']; ?>" data-i18n="<?php echo $row['status']; ?>">
                                <?php echo ucfirst($row['status']); ?>
                            </span>
                        </div>
                        <div class="card-content">
                            <div class="info-group">
                                <label data-i18n="position">Position</label>
                                <strong><?php echo htmlspecialchars($row['desired_position']); ?></strong>
                            </div>
                            <div class="info-group">
                                <label data-i18n="studentId">Student ID</label>
                                <span><?php echo htmlspecialchars($row['student_id']); ?></span>
                            </div>
                            <div class="info-group">
                                <label data-i18n="faculty">Faculty</label>
                                <span><?php echo htmlspecialchars($row['faculty'] ?? ''); ?></span>
                            </div>
                            <div class="info-group">
                                <label data-i18n="major">Major</label>
                                <span><?php echo htmlspecialchars($row['major']); ?></span>
                            </div>
                            <div class="info-group">
                                <label data-i18n="gpa">GPA</label>
                                <span><?php echo htmlspecialchars($row['gpa']); ?></span>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <?php if($row['status'] == 'pending'): ?>
                                <button class="btn btn-accept" onclick="sendApplicationEmail(<?php echo $row['id']; ?>, '<?php echo htmlspecialchars($row['email']); ?>', '<?php echo htmlspecialchars($row['first_name']); ?>', 'accept', '<?php echo htmlspecialchars($row['desired_position']); ?>')">
                                    <i class="fas fa-check"></i> <span data-i18n="accept">Accept</span>
                                </button>
                                <button class="btn btn-reject" onclick="sendApplicationEmail(<?php echo $row['id']; ?>, '<?php echo htmlspecialchars($row['email']); ?>', '<?php echo htmlspecialchars($row['first_name']); ?>', 'reject', '<?php echo htmlspecialchars($row['desired_position']); ?>')">
                                    <i class="fas fa-times"></i> <span data-i18n="reject">Reject</span>
                                </button>
                            <?php endif; ?>
                            <?php if($row['status'] == 'accepted'): ?>
                                <?php
                                    $create_params = http_build_query([
                                        'from_application' => $row['id'],
                                        'full_name' => $row['first_name'] . ' ' . $row['last_name'],
                                        'email' => $row['email'],
                                        'phone' => $row['phone'],
                                        'faculty' => $row['faculty'] ?? '',
                                        'study' => $row['major'],
                                        'year' => $row['academic_year'],
                                        'position' => $row['desired_position'],
                                    ]);
                                ?>
                                <a class="btn btn-create-account" href="add_user.php?<?php echo htmlspecialchars($create_params); ?>">
                                    <i class="fas fa-user-plus"></i> <span data-i18n="createAccount">Create Account</span>
                                </a>
                            <?php endif; ?>
                            <button class="btn btn-view" onclick="viewApplication(<?php echo $row['id']; ?>)">
                                <i class="fas fa-eye"></i> <span data-i18n="viewDetails">View Details</span>
                            </button>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>
        </div>

    <script>
        function getT() {
            const lang = localStorage.getItem('language') || 'en';
            return adminTranslations[lang] || adminTranslations.en;
        }

        // Filter functionality
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelector('.filter-btn.active').classList.remove('active');
                button.classList.add('active');

                const filter = button.dataset.filter;
                document.querySelectorAll('.application-card').forEach(card => {
                    if (filter === 'all' || card.dataset.status === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Process application
        async function processApplication(id, action) {
            try {
                const t = getT();
                const confirmMsg = action === 'accept' ? t.confirmAccept : t.confirmReject;
                if (!confirm(confirmMsg)) {
                    return;
                }

                const response = await fetch('process_application.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id, action: action }),
                    credentials: 'same-origin'
                });

                const responseText = await response.text();
                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (e) {
                    throw new Error('Server response is not valid JSON: ' + responseText);
                }

                if (data.status === 'success') {
                    alert(data.message);
                    location.reload();
                } else {
                    throw new Error(data.message || 'Unknown error occurred');
                }
            } catch (error) {
                console.error('Error details:', error);
                alert('Error processing application: ' + error.message);
            }
        }

        // View application details
        function viewApplication(id) {
            window.location.href = `application_details.php?id=${id}`;
        }

        function sendApplicationEmail(id, email, name, action, position) {
            const t = getT();
            let subject, body;

            const positionText = {
                'mechanical': t.mechanicalTeam,
                'electrical': t.electricalTeam,
                'software': t.softwareTeam,
                'marketing': t.marketingTeam
            }[position] || position;

            if (action === 'accept') {
                subject = encodeURIComponent(t.emailAcceptSubject);
                body = encodeURIComponent(`Dear ${name},

We are pleased to inform you that your application to join the Black Hornets Racing Team for the ${positionText} position has been accepted!

We were impressed with your qualifications and enthusiasm, and we believe you will be a valuable addition to our team.

Next Steps:
1. Please confirm your acceptance by replying to this email
2. Attend our orientation meeting (details will be sent separately)
3. Complete the team registration form

Welcome to the team!

Best regards,
Black Hornets Racing Team`);
            } else {
                subject = encodeURIComponent(t.emailRejectSubject);
                body = encodeURIComponent(`Dear ${name},

Thank you for your interest in joining the Black Hornets Racing Team and for taking the time to apply for the ${positionText} position.

After careful consideration of your application, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We appreciate your interest in our team and wish you the best in your future endeavors.

Best regards,
Black Hornets Racing Team`);
            }

            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

            setTimeout(() => {
                const statusText = action === 'accept' ? t.accepted : t.rejected;
                if (confirm(`${t.updateStatusConfirm} ${statusText.toLowerCase()}?`)) {
                    processApplication(id, action);
                }
            }, 1000);
        }
    </script>
    </div>
</body>
</html>

<?php
$conn->close();
?> 
