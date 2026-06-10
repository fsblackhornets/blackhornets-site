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

    // TODO: [PRODUCTION] يجب حذف هذا الكود وتعويضه بإعدادات SMTP الحقيقية
    // TODO: [PRODUCTION] قم بتثبيت PHPMailer باستخدام: composer require phpmailer/phpmailer
    // TODO: [PRODUCTION] استخدم الكود أدناه بدلاً من محاكاة الإرسال
    /*
    require 'vendor/autoload.php';
    use PHPMailer\PHPMailer\PHPMailer;
    
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.your-domain.com';        // TODO: ضع خادم SMTP الخاص بك
    $mail->SMTPAuth = true;
    $mail->Username = 'your-email@domain.com';   // TODO: ضع بريدك الإلكتروني
    $mail->Password = 'your-smtp-password';      // TODO: ضع كلمة مرور SMTP
    */

    // هذا الكود للتطوير المحلي فقط - سيتم حذفه في الإنتاج
    $logMessage = date('Y-m-d H:i:s') . " - Attempted to send email to: " . $_POST['emailTo'] . "\n";
    file_put_contents('email_log.txt', $logMessage, FILE_APPEND);

    // TODO: [PRODUCTION] سيتم حذف هذه المحاكاة واستبدالها بإرسال بريد حقيقي
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

// TODO: [PRODUCTION] قائمة المهام قبل الإطلاق:
// 1. تثبيت PHPMailer
// 2. إعداد حساب SMTP (مثل Amazon SES أو SendGrid)
// 3. تحديث معلومات SMTP في ملف تكوين منفصل
// 4. اختبار إرسال البريد على الخادم الحقيقي
// 5. إعداد نظام تسجيل الأخطاء
// 6. التأكد من تأمين اتصال SMTP
// 7. إضافة قالب HTML للبريد الإلكتروني
?> 