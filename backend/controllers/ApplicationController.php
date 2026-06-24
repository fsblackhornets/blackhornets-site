<?php

class ApplicationController {
    public function __construct(private mysqli $conn) {}

    public function submit(array $params = []): void {
        // Honeypot
        if (!empty(trim($_POST['company_name'] ?? ''))) {
            Response::json(['status' => 'success', 'message' => 'Application submitted!']);
        }

        // reCAPTCHA v3 server-side verification
        require_once __DIR__ . '/../helpers/recaptcha_helper.php';
        $recaptchaToken  = $_POST['recaptcha_token'] ?? '';
        $recaptchaSecret = get_recaptcha_keys()['secret_key'] ?? '';
        if (!empty($recaptchaSecret) && !verify_recaptcha($recaptchaToken, $recaptchaSecret)) {
            Response::error('reCAPTCHA verification failed. Please try again.', 403);
        }

        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
        $ip = trim(explode(',', $ip)[0]);

        // Max 3 submissions per IP per 24h
        $ipCheck = $this->conn->prepare("SELECT COUNT(*) FROM applications WHERE ip_address = ? AND created_at > NOW() - INTERVAL 24 HOUR");
        $ipCheck->bind_param('s', $ip);
        $ipCheck->execute();
        if ($ipCheck->get_result()->fetch_row()[0] >= 3) {
            Response::error('Too many applications submitted. Please try again tomorrow.', 429);
        }

        // One application per email per 30 days
        $emailCheck = $this->conn->prepare("SELECT COUNT(*) FROM applications WHERE email = ? AND created_at > NOW() - INTERVAL 30 DAY");
        $email = trim($_POST['email'] ?? '');
        $emailCheck->bind_param('s', $email);
        $emailCheck->execute();
        if ($emailCheck->get_result()->fetch_row()[0] >= 1) {
            Response::error('An application from this email was already submitted in the last 30 days.', 429);
        }

        $required = ['firstName','lastName','email','phone','studentId','faculty','major','academic_year','years_studying','gpa','position','motivation'];
        foreach ($required as $field) {
            if (empty(trim($_POST[$field] ?? ''))) {
                Response::error(ucfirst($field) . ' is required.');
            }
        }

        if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email address.');
        }

        // PDF upload
        if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
            Response::error('Please upload a resume (PDF).');
        }

        $file = $_FILES['resume'];
        if ($file['type'] !== 'application/pdf') {
            Response::error('Only PDF files are allowed.');
        }
        if ($file['size'] > 5 * 1024 * 1024) {
            Response::error('File size must be under 5MB.');
        }

        $uploadDir  = __DIR__ . '/../../uploads/resumes/';
        $filename   = uniqid('cv_') . '.pdf';
        if (!move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
            Response::error('Failed to upload file.', 500);
        }
        $resumePath = 'uploads/resumes/' . $filename;

        $firstName  = htmlspecialchars(trim($_POST['firstName']),  ENT_QUOTES, 'UTF-8');
        $lastName   = htmlspecialchars(trim($_POST['lastName']),   ENT_QUOTES, 'UTF-8');
        $email      = trim($_POST['email']);
        $phone      = htmlspecialchars(trim($_POST['phone']),      ENT_QUOTES, 'UTF-8');
        $studentId  = htmlspecialchars(trim($_POST['studentId']),  ENT_QUOTES, 'UTF-8');
        $faculty    = htmlspecialchars(trim($_POST['faculty']),    ENT_QUOTES, 'UTF-8');
        $major      = htmlspecialchars(trim($_POST['major']),      ENT_QUOTES, 'UTF-8');
        $year          = htmlspecialchars(trim($_POST['academic_year']), ENT_QUOTES, 'UTF-8');
        $yearsStudying = max(1, min(10, (int)($_POST['years_studying'] ?? 1)));
        $gpa           = (float)$_POST['gpa'];
        $position   = htmlspecialchars(trim($_POST['position']),   ENT_QUOTES, 'UTF-8');
        $experience = htmlspecialchars(trim($_POST['experience'] ?? ''), ENT_QUOTES, 'UTF-8');
        $motivation = htmlspecialchars(trim($_POST['motivation']), ENT_QUOTES, 'UTF-8');

        $stmt = $this->conn->prepare("
            INSERT INTO applications
                (first_name, last_name, email, phone, student_id, faculty, major,
                 academic_year, years_studying, gpa, desired_position, experience, motivation, resume_path, ip_address, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
        ");

        if (!$stmt) Response::error('Database error.', 500);

        $stmt->bind_param('ssssssssiidssss',
            $firstName, $lastName, $email, $phone, $studentId,
            $faculty, $major, $year, $yearsStudying, $gpa, $position,
            $experience, $motivation, $resumePath, $ip
        );

        if ($stmt->execute()) {
            // Notify team
            $to      = 'formulastudentftn@gmail.com';
            $subject = "[Application] {$firstName} {$lastName} — {$position}";
            $body    = "New application received:\n\n"
                     . "Name: {$firstName} {$lastName}\n"
                     . "Email: {$email}\n"
                     . "Phone: {$phone}\n"
                     . "Student ID: {$studentId}\n"
                     . "Faculty: {$faculty}\n"
                     . "Major: {$major}\n"
                     . "Year: {$year} (studying {$yearsStudying} years)\n"
                     . "GPA: {$gpa}\n"
                     . "Position: {$position}\n\n"
                     . "Motivation:\n{$motivation}\n";
            $headers = "From: noreply@fsblackhornets.org.rs\r\nReply-To: {$email}";
            @mail($to, $subject, $body, $headers);

            Response::json(['status' => 'success', 'message' => 'Application submitted successfully! We will review it and contact you soon.']);
        } else {
            Response::error('Failed to submit application. Please try again.', 500);
        }

        $stmt->close();
    }
}
