<?php

class ContactController {
    public function __construct(private mysqli $conn) {}

    public function send(array $params = []): void {
        $name     = trim($_POST['name']        ?? '');
        $email    = trim($_POST['email']       ?? '');
        $subject  = trim($_POST['subject']     ?? '');
        $message  = trim($_POST['message']     ?? '');
        $honeypot = trim($_POST['website_url'] ?? '');

        // Honeypot — silently succeed for bots
        if (!empty($honeypot)) {
            Response::json(['status' => 'success', 'message' => 'Message sent successfully!']);
        }

        if (empty($name) || empty($email) || empty($subject) || empty($message)) {
            Response::error('All fields are required.');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email address.');
        }

        $name    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
        $subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
        $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

        $stmt = $this->conn->prepare("
            INSERT INTO contact_messages (name, email, subject, message, created_at)
            VALUES (?, ?, ?, ?, NOW())
        ");

        if (!$stmt) Response::error('Database error.', 500);

        $stmt->bind_param('ssss', $name, $email, $subject, $message);

        if ($stmt->execute()) {
            Response::json(['status' => 'success', 'message' => 'Message sent! We will get back to you soon.']);
        } else {
            Response::error('Failed to send message. Please try again.', 500);
        }

        $stmt->close();
    }
}
