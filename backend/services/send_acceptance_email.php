<?php
header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['admin_logged_in'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

try {
    if (!isset($_POST['emailTo'], $_POST['emailSubject'], $_POST['emailBody'])) {
        throw new Exception('Missing required fields');
    }

    /*
    require 'vendor/autoload.php';
    use PHPMailer\PHPMailer\PHPMailer;
    
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    */

    $logMessage = date('Y-m-d H:i:s') . " - Attempted to send email to: " . $_POST['emailTo'] . "\n";
    file_put_contents('email_log.txt', $logMessage, FILE_APPEND);

    echo json_encode([
        'status' => 'success',
        'message' => 'Email sent successfully (Development Mode)'
    ]);

} catch (Exception $e) {
    error_log('Email sending error: ' . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

?> 