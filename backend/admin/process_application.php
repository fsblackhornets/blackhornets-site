<?php
require_once __DIR__ . '/../../panel/admin/auth.php';
$user = checkAuth('admin');

header('Content-Type: application/json');
require_once __DIR__ . '/../config/database.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['id']) || !isset($data['action'])) {
        throw new Exception('Missing required parameters');
    }

    $id     = (int)$data['id'];
    $action = $data['action'];

    if (!in_array($action, ['accept', 'reject'])) {
        throw new Exception('Invalid action');
    }

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) throw new Exception("Connection failed: " . $conn->connect_error);

    // Fetch applicant details before update
    $stmt = $conn->prepare("SELECT first_name, last_name, email, desired_position FROM applications WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $applicant = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$applicant) throw new Exception('Application not found');

    // Update status
    $status = ($action === 'accept') ? 'accepted' : 'rejected';
    $stmt   = $conn->prepare("UPDATE applications SET status = ? WHERE id = ?");
    $stmt->bind_param('si', $status, $id);

    if (!$stmt->execute()) throw new Exception('Error updating application status');

    // Send email on accept
    if ($action === 'accept') {
        $name     = htmlspecialchars($applicant['first_name'] . ' ' . $applicant['last_name'], ENT_QUOTES, 'UTF-8');
        $email    = $applicant['email'];
        $position = htmlspecialchars($applicant['desired_position'] ?? 'team member', ENT_QUOTES, 'UTF-8');

        $subject  = "Black Hornets Racing — Application Approved!";
        $body     = "Dear {$name},\n\n"
                  . "We are pleased to inform you that your application to join Black Hornets Racing "
                  . "for the position of {$position} has been APPROVED!\n\n"
                  . "Our team will contact you shortly with the next steps.\n\n"
                  . "Thank you for your interest in Black Hornets Racing.\n\n"
                  . "Best regards,\n"
                  . "Black Hornets Racing Team\n"
                  . "formulastudentftn@gmail.com";

        $headers  = "From: noreply@fsblackhornets.org.rs\r\n"
                  . "Reply-To: formulastudentftn@gmail.com\r\n"
                  . "Content-Type: text/plain; charset=UTF-8\r\n"
                  . "X-Mailer: PHP/" . phpversion();

        @mail($email, $subject, $body, $headers);
    }

    echo json_encode([
        'status'  => 'success',
        'message' => "Application has been {$status} successfully"
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
