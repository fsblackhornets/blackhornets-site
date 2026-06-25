<?php
require_once __DIR__ . '/../../panel/admin/auth.php';
$user = checkAuth('admin');

header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/email_helper.php';

try {
    $data   = json_decode(file_get_contents('php://input'), true);
    $id     = (int)($data['id'] ?? 0);
    $action = $data['action'] ?? '';

    if (!$id || !in_array($action, ['accept', 'reject'])) {
        throw new Exception('Missing or invalid parameters');
    }

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) throw new Exception("DB connection failed");

    $stmt = $conn->prepare("SELECT first_name, last_name, email, desired_position FROM applications WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $applicant = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$applicant) throw new Exception('Application not found');

    $status = $action === 'accept' ? 'accepted' : 'rejected';
    $stmt   = $conn->prepare("UPDATE applications SET status = ? WHERE id = ?");
    $stmt->bind_param('si', $status, $id);
    if (!$stmt->execute()) throw new Exception('Error updating status');

    if ($action === 'accept') {
        $name     = trim($applicant['first_name'] . ' ' . $applicant['last_name']);
        $email    = $applicant['email'];
        $position = $applicant['desired_position'] ?? 'team member';

        $subject = "Black Hornets Racing — Application Approved!";
        $body    = "Dear {$name},\n\n"
                 . "We are pleased to inform you that your application to join Black Hornets Racing "
                 . "for the position of {$position} has been APPROVED!\n\n"
                 . "Our team will contact you shortly with further details and next steps.\n\n"
                 . "Thank you for your interest in Black Hornets Racing.\n\n"
                 . "Best regards,\n"
                 . "Black Hornets Racing Team\n"
                 . SMTP_FROM;

        sendEmail($email, $name, $subject, $body);
    }

    echo json_encode(['status' => 'success', 'message' => "Application {$status} successfully"]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
