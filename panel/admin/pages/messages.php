<?php
require_once '../auth.php';
$user = checkAuth('admin');


// Database connection settings
require_once __DIR__ . '/../../../backend/config/database.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get messages with pagination
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 10;
$offset = ($page - 1) * $limit;

$total_query = "SELECT COUNT(*) as total FROM contact_messages";
$total_result = $conn->query($total_query);
$total_messages = $total_result->fetch_assoc()['total'];
$total_pages = ceil($total_messages / $limit);

$messages_sql = "SELECT * FROM contact_messages 
                 ORDER BY created_at DESC 
                 LIMIT ? OFFSET ?";
$stmt = $conn->prepare($messages_sql);
$stmt->bind_param('ii', $limit, $offset);
$stmt->execute();
$messages_result = $stmt->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/frontend/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Messages - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/dashboard.css">
    <link rel="stylesheet" href="../css/messages.css">
</head>
<body>
     <div class="dashboard-container">
        <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

        <div class="messages-container">
            <h2 data-i18n="messagesManagement">Messages</h2>
            <?php while ($message = $messages_result->fetch_assoc()): ?>
                <div class="message-card">
                    <div class="message-header">
                        <div class="sender-info">
                            <h3><?php echo htmlspecialchars($message['name']); ?></h3>
                            <a href="mailto:<?php echo htmlspecialchars($message['email']); ?>" 
                               class="email"><?php echo htmlspecialchars($message['email']); ?></a>
                        </div>
                        <span class="message-date">
                            <?php echo date('F j, Y H:i', strtotime($message['created_at'])); ?>
                        </span>
                    </div>
                    
                    <div class="message-subject">
                        <?php echo htmlspecialchars($message['subject']); ?>
                    </div>
                    
                    <div class="message-content">
                        <?php echo nl2br(htmlspecialchars($message['message'])); ?>
                    </div>

                    <div class="message-actions">
                        <button class="reply-btn" data-email="<?php echo htmlspecialchars($message['email']); ?>">
                            <i class="fas fa-reply"></i> <span data-i18n="reply">Reply</span>
                        </button>
                        <button class="delete-btn" data-id="<?php echo $message['id']; ?>">
                            <i class="fas fa-trash"></i> <span data-i18n="delete">Delete</span>
                        </button>
                    </div>
                </div>
            <?php endwhile; ?>

            <?php if ($total_pages > 1): ?>
                <div class="pagination">
                    <?php for ($i = 1; $i <= $total_pages; $i++): ?>
                        <a href="?page=<?php echo $i; ?>" 
                           class="page-link <?php echo $page === $i ? 'active' : ''; ?>">
                            <?php echo $i; ?>
                        </a>
                    <?php endfor; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <script>
    function getT() {
        const lang = localStorage.getItem('language') || 'en';
        return adminTranslations[lang] || adminTranslations.en;
    }

    document.addEventListener('DOMContentLoaded', function() {
        // Reply functionality
        document.querySelectorAll('.reply-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const email = this.dataset.email;
                window.location.href = `mailto:${email}`;
            });
        });

        // Delete functionality
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const t = getT();
                if (confirm(t.confirmDeleteMessage)) {
                    const id = this.dataset.id;
                    try {
                        const response = await fetch('/backend/admin/delete_message.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ id: id })
                        });
                        const data = await response.json();
                        if (data.status === 'success') {
                            this.closest('.message-card').remove();
                        } else {
                            alert(t.errorDeletingMessage || 'Error deleting message');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert(t.errorDeletingMessage || 'Error deleting message');
                    }
                }
            });
        });
    });
    </script>
</body>
</html>

<?php
$stmt->close();
$conn->close();
?> 