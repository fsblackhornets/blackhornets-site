<?php

class RequestController {
    private RequestService $service;

    public function __construct(mysqli $conn) {
        $this->service = new RequestService(new RequestRepository($conn), $conn);
    }

    public function index(array $params = []): void {
        $role   = $_SESSION['role'] ?? '';
        $userId = $role !== 'admin' ? ($_SESSION['user_id'] ?? null) : null;
        $data   = $this->service->getAll($_GET['status'] ?? null, $_GET['type'] ?? null, $userId);
        Response::json(['success' => true, 'data' => $data, 'total' => count($data)]);
    }

    public function create(array $params = []): void {
        if (!in_array($_SESSION['role'] ?? '', ['manager', 'admin'])) Response::forbidden();

        $type = $_POST['type'] ?? null;
        if (!in_array($type, ['member','post','project','sponsor'])) Response::error('Invalid type');

        $data = match ($type) {
            'member'  => $this->memberData(),
            'post'    => $this->postData(),
            'project' => $this->projectData(),
            'sponsor' => $this->sponsorData(),
        };

        if ($type === 'member') {
            if (empty($data['email'])) Response::error('Email is required.');
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) Response::error('Invalid email address.');
            if (empty($data['full_name'])) Response::error('Full name is required.');
        }

        // Handle file uploads
        $fileMap = [
            'post'    => ['field' => 'image',           'dir' => __DIR__ . '/../../frontend/uploads/pending/', 'store' => 'path'],
            'project' => ['field' => 'image',           'dir' => __DIR__ . '/../../frontend/uploads/pending/', 'store' => 'path'],
            'sponsor' => ['field' => 'logo',            'dir' => __DIR__ . '/../../frontend/uploads/pending/', 'store' => 'path'],
            'member'  => ['field' => 'profile_picture', 'dir' => __DIR__ . '/../../uploads/profiles/',         'store' => 'filename'],
        ];

        if (isset($fileMap[$type])) {
            $fm       = $fileMap[$type];
            $field    = $fm['field'];
            $allowed  = ['jpg','jpeg','png','gif','webp','svg'];

            if (isset($_FILES[$field]) && $_FILES[$field]['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES[$field];
                $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

                if (in_array($ext, $allowed) && $file['size'] <= 10 * 1024 * 1024) {
                    if (!is_dir($fm['dir'])) mkdir($fm['dir'], 0755, true);
                    $filename = uniqid('req_') . '.' . $ext;

                    if (move_uploaded_file($file['tmp_name'], $fm['dir'] . $filename)) {
                        $data[$field] = $fm['store'] === 'filename'
                            ? $filename
                            : 'uploads/pending/' . $filename;
                    }
                }
            }
        }

        $id = $this->service->create($type, $data, (int)$_SESSION['user_id'], $_SESSION['full_name'] ?? '');
        Response::json(['success' => true, 'message' => 'Request submitted. Awaiting admin approval.', 'id' => $id], 201);
    }

    public function review(array $params): void {
        if (($_SESSION['role'] ?? '') !== 'admin') Response::forbidden();

        $input      = json_decode(file_get_contents('php://input'), true);
        $id         = (int)($input['id'] ?? 0);
        $action     = $input['action'] ?? '';
        $notes      = $input['notes'] ?? null;
        $editedData = $input['editedData'] ?? null; // optional admin edits

        if (!$id || !in_array($action, ['approve','decline'])) Response::error('Invalid parameters');

        // If admin edited the data, update it before approving
        if ($editedData && is_array($editedData)) {
            $this->service->updateRequestData($id, $editedData);
        }

        if ($action === 'approve') {
            $this->service->approve($id, $notes, (int)$_SESSION['user_id']);
        } else {
            $this->service->decline($id, $notes, (int)$_SESSION['user_id']);
        }

        Response::json(['success' => true, 'message' => ucfirst($action) . 'd successfully']);
    }

    private function memberData(): array {
        return [
            'full_name'     => trim($_POST['full_name']     ?? ''),
            'email'         => trim($_POST['email']         ?? ''),
            'phone'         => trim($_POST['phone']         ?? ''),
            'team'          => trim($_POST['team']          ?? ''),
            'department'    => trim($_POST['department']    ?? ''),
            'role'          => trim($_POST['role']          ?? 'team_member'),
            'position'      => trim($_POST['position']      ?? ''),
            'faculty'       => trim($_POST['faculty']       ?? ''),
            'study_field'    => trim($_POST['study_field']    ?? ''),
            'academic_year'  => trim($_POST['academic_year']  ?? ''),
            'image_position' => trim($_POST['image_position'] ?? '50% 50%'),
        ];
    }

    private function postData(): array {
        return [
            'title_sr'   => trim($_POST['title_sr']   ?? ''),
            'title_en'   => trim($_POST['title_en']   ?? ''),
            'content_sr' => trim($_POST['content_sr'] ?? ''),
            'content_en' => trim($_POST['content_en'] ?? ''),
            'category'       => trim($_POST['category']       ?? ''),
            'image_position' => trim($_POST['image_position'] ?? '50% 50%'),
        ];
    }

    private function projectData(): array {
        return [
            'name'           => trim($_POST['name']           ?? ''),
            'description'    => trim($_POST['description']    ?? ''),
            'status'         => trim($_POST['status']         ?? 'pending'),
            'progress'       => (int)($_POST['progress']      ?? 0),
            'due_date'       => trim($_POST['due_date']       ?? ''),
            'duration'       => trim($_POST['duration']       ?? ''),
            'image_position' => trim($_POST['image_position'] ?? '50% 50%'),
        ];
    }

    private function sponsorData(): array {
        return [
            'name'           => trim($_POST['name']           ?? ''),
            'tier'           => trim($_POST['tier']           ?? ''),
            'website'        => trim($_POST['website']        ?? ''),
            'description_sr' => trim($_POST['description_sr'] ?? ''),
            'description_en' => trim($_POST['description_en'] ?? ''),
            'image_position' => trim($_POST['image_position'] ?? '50% 50%'),
        ];
    }
}
