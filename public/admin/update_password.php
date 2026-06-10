<?php
// This script updates plain text passwords to hashed passwords
require_once __DIR__ . '/../../src/config/database.php';

try {
    // Get all users with plain text passwords (not starting with $2y$)
    $result = $conn->query("SELECT id, username, password FROM users WHERE password NOT LIKE '$2y$%'");
    
    if ($result->num_rows > 0) {
        echo "<h2>Updating passwords...</h2>";
        
        while ($user = $result->fetch_assoc()) {
            $hashed_password = password_hash($user['password'], PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->bind_param("si", $hashed_password, $user['id']);
            
            if ($stmt->execute()) {
                echo "✓ Updated password for user: <strong>{$user['username']}</strong><br>";
            } else {
                echo "✗ Failed to update password for user: {$user['username']}<br>";
            }
            
            $stmt->close();
        }
        
        echo "<br><strong>Done! All passwords have been hashed.</strong><br>";
        echo "<a href='login.php'>Go to Login</a>";
    } else {
        echo "<h2>All passwords are already hashed!</h2>";
        echo "<a href='login.php'>Go to Login</a>";
    }
    
    $conn->close();
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
