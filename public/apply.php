<?php
// Start output buffering to prevent any output before headers
ob_start();

// منع عرض أخطاء PHP مباشرة
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/apply_errors.log');

try {
    // تعيين headers مناسبة
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');

    // Include database configuration
    if (!file_exists(__DIR__ . '/../src/config/database.php')) {
        throw new Exception("Database configuration file not found");
    }
    require_once __DIR__ . '/../src/config/database.php';
    
    if (!file_exists(__DIR__ . '/../src/utils/SecureFileUpload.php')) {
        throw new Exception("SecureFileUpload class not found");
    }
    require_once __DIR__ . '/../src/utils/SecureFileUpload.php';
    require_once __DIR__ . '/../src/helpers/recaptcha_helper.php';

    // Clear any output that might have been generated
    ob_clean();
    // التحقق من طريقة الطلب
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Invalid request method");
    }

    // Honeypot check - if filled, it's a bot
    if (!check_honeypot($_POST['company_name'] ?? '')) {
        echo json_encode(['status' => 'success', 'message' => 'Your application has been submitted successfully!']);
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
    $required_fields = ['firstName', 'lastName', 'email', 'phone', 'studentId',
                       'faculty', 'major', 'academic_year', 'gpa', 'position', 'motivation'];
    
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            throw new Exception("Missing required field: $field");
        }
    }

    // التحقق من الملف
    if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Resume file is required");
    }

    // إنشاء اتصال بقاعدة البيانات
    if ($conn->connect_error) {
        throw new Exception("Database connection failed");
    }

    // تنظيف وتحقق من البيانات
    $firstName = htmlspecialchars(trim($_POST['firstName']), ENT_QUOTES, 'UTF-8');
    $lastName = htmlspecialchars(trim($_POST['lastName']), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST['phone']), ENT_QUOTES, 'UTF-8');
    $studentId = htmlspecialchars(trim($_POST['studentId']), ENT_QUOTES, 'UTF-8');
    $faculty = htmlspecialchars(trim($_POST['faculty']), ENT_QUOTES, 'UTF-8');
    $major = htmlspecialchars(trim($_POST['major']), ENT_QUOTES, 'UTF-8');
    $academic_year = filter_var(trim($_POST['academic_year']), FILTER_SANITIZE_NUMBER_INT);
    $gpa = filter_var(trim($_POST['gpa']), FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $position = htmlspecialchars(trim($_POST['position']), ENT_QUOTES, 'UTF-8');
    $experience = htmlspecialchars(trim($_POST['experience'] ?? ''), ENT_QUOTES, 'UTF-8');
    $motivation = htmlspecialchars(trim($_POST['motivation']), ENT_QUOTES, 'UTF-8');

    // التحقق من صحة البريد الإلكتروني
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // معالجة ملف السيرة الذاتية بشكل آمن
    $upload_dir = __DIR__ . '/uploads/resumes/';
    $uploader = new SecureFileUpload($upload_dir, ['pdf'], 5 * 1024 * 1024); // 5MB max
    
    $resume_filename = $uploader->upload($_FILES['resume']);
    
    if (!$resume_filename) {
        throw new Exception($uploader->getLastError());
    }

    // إدخال البيانات في قاعدة البيانات
    $stmt = $conn->prepare("
        INSERT INTO applications (
            first_name, last_name, email, phone, student_id,
            faculty, major, academic_year, gpa, desired_position,
            experience, motivation, resume_path, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ");

    if (!$stmt) {
        throw new Exception("Query preparation failed");
    }

    $stmt->bind_param("sssssssidssss",
        $firstName,
        $lastName,
        $email,
        $phone,
        $studentId,
        $faculty,
        $major,
        $academic_year,
        $gpa,
        $position,
        $experience,
        $motivation,
        $resume_filename
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to save application");
    }

    // إرجاع رسالة نجاح
    echo json_encode([
        'status' => 'success',
        'message' => 'Your application has been submitted successfully!'
    ]);

} catch (Exception $e) {
    // Clear any previous output
    ob_clean();
    
    // تسجيل الخطأ
    error_log("Application Form Error: " . $e->getMessage());
    
    // إرجاع رسالة خطأ للمستخدم
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);

} finally {
    // إغلاق الاتصالات
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
    
    // Flush output buffer
    ob_end_flush();
}
?>
