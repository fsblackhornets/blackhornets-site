<?php
session_start();

// Check if user is logged in and has admin or team member access
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    die('Access denied. Please login.');
}

// Get the resume filename from query parameter
$filename = $_GET['file'] ?? '';

if (empty($filename)) {
    http_response_code(400);
    die('No file specified.');
}

// Sanitize filename to prevent directory traversal
$filename = basename($filename);

// Build the full path to the resume file
$file_path = __DIR__ . '/uploads/resumes/' . $filename;

// Check if file exists
if (!file_exists($file_path)) {
    http_response_code(404);
    die('File not found.');
}

// Check if it's a PDF file
$file_info = pathinfo($file_path);
if (strtolower($file_info['extension']) !== 'pdf') {
    http_response_code(403);
    die('Invalid file type.');
}

// Set headers to display PDF
header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="' . $filename . '"');
header('Content-Length: ' . filesize($file_path));
header('Cache-Control: private, max-age=0, must-revalidate');
header('Pragma: public');

// Output the file
readfile($file_path);
exit;
?>
