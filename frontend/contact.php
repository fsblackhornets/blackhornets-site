<?php
// تعيين headers مناسبة
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// منع عرض أخطاء PHP مباشرة
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Include database configuration
require_once __DIR__ . '/../backend/config/database.php';
require_once __DIR__ . '/../backend/helpers/recaptcha_helper.php';

try {
    // التحقق من طريقة الطلب
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Invalid request method");
    }

    // Honeypot check - if filled, it's a bot
    if (!check_honeypot($_POST['website_url'] ?? '')) {
        // Silently reject - don't tell bots why
        echo json_encode(['status' => 'success', 'message' => 'Thank you! Your message has been sent successfully.']);
        exit;
    }

    // reCAPTCHA v3 verification
    $recaptcha_keys = get_recaptcha_keys();
    if (!empty($recaptcha_keys['secret_key'])) {
        $recaptcha_token = $_POST['recaptcha_token'] ?? '';
        if (!empty($recaptcha_token) && !verify_recaptcha($recaptcha_token, $recaptcha_keys['secret_key'])) {
            throw new Exception("Spam detection triggered. Please try again.");
        }
    }

    // التحقق من وجود البيانات المطلوبة
    if (!isset($_POST['name']) || !isset($_POST['email']) ||
        !isset($_POST['subject']) || !isset($_POST['message'])) {
        throw new Exception("Missing required fields");
    }

    // التحقق من الاتصال
    if ($conn->connect_error) {
        throw new Exception("Database connection failed");
    }

    // تنظيف وتحقق من البيانات
    $name = htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars(trim($_POST['subject']), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($_POST['message']), ENT_QUOTES, 'UTF-8');

    // التحقق من صحة البيانات
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        throw new Exception("All fields are required");
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // تجهيز وتنفيذ الاستعلام
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Query preparation failed");
    }

    $stmt->bind_param("ssss", $name, $email, $subject, $message);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to save message");
    }

    // إرجاع رسالة نجاح
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you! Your message has been sent successfully.'
    ]);

} catch (Exception $e) {
    // تسجيل الخطأ
    error_log("Contact Form Error: " . $e->getMessage());
    
    // إرجاع رسالة خطأ للمستخدم
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Sorry, there was an error sending your message. Please try again.'
    ]);

} finally {
    // إغلاق الاتصالات
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
