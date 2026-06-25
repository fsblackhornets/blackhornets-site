<?php

class BrochureController {
    private BrochureService $service;

    public function __construct(mysqli $conn) {
        $this->service = new BrochureService(new BrochureRepository($conn));
    }

    public function show(array $params = []): void {
        $lang = ($_GET['lang'] ?? 'sr') === 'en' ? 'en' : 'sr';
        $data = $this->service->get($lang);
        Response::json($data
            ? ['success' => true, 'data' => $data]
            : ['success' => false, 'data' => null, 'message' => 'No brochure uploaded yet']
        );
    }

    public function showAll(array $params = []): void {
        if (($_SESSION['role'] ?? '') !== 'admin') Response::forbidden();
        $sr = $this->service->get('sr');
        $en = $this->service->get('en');
        Response::json(['success' => true, 'data' => ['sr' => $sr, 'en' => $en]]);
    }

    public function upload(array $params = []): void {
        if (($_SESSION['role'] ?? '') !== 'admin') Response::forbidden();

        $lang = ($_POST['lang'] ?? 'sr') === 'en' ? 'en' : 'sr';

        if (!isset($_FILES['brochure_pdf']) || $_FILES['brochure_pdf']['error'] !== UPLOAD_ERR_OK) {
            Response::error('No PDF uploaded.');
        }

        $file = $_FILES['brochure_pdf'];
        if ($file['size'] > 20 * 1024 * 1024) Response::error('File too large (max 20 MB).');

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($ext !== 'pdf') Response::error('Only PDF files are accepted.');

        $dir = __DIR__ . '/../../panel/admin/uploads/brochure/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $filename = 'brochure_' . $lang . '_' . time() . '.pdf';
        if (!move_uploaded_file($file['tmp_name'], $dir . $filename)) {
            Response::error('Failed to save file.');
        }

        $path = 'uploads/brochure/' . $filename;
        $key  = 'brochure_pdf_' . $lang;
        $userId = (int)($_SESSION['user_id'] ?? 0);

        $stmt = $this->service->repo()->upsert($key, $path, $userId);

        Response::json(['success' => true, 'lang' => $lang, 'path' => $path]);
    }
}
