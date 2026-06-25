<?php

class GalleryController {
    private GalleryService $service;

    public function __construct(mysqli $conn) {
        $this->service = new GalleryService(new GalleryRepository($conn));
    }

    public function index(array $params = []): void {
        $category = $_GET['category'] ?? null;
        $data = $this->service->getAll($category);
        Response::json(['success' => true, 'data' => $data, 'count' => count($data)]);
    }

    public function adminIndex(array $params = []): void {
        $data = $this->service->getAllAdmin();
        Response::json(['success' => true, 'data' => $data]);
    }

    public function create(array $params = []): void {
        if (!in_array($_SESSION['role'] ?? '', ['manager', 'admin'])) Response::forbidden();
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            Response::error('No image uploaded.');
        }
        $category = trim($_POST['category'] ?? '');
        $title    = trim($_POST['title']    ?? '');
        if (empty($category)) Response::error('Category is required.');

        $id = $this->service->upload($_FILES['image'], $category, $title, (int)$_SESSION['user_id']);
        Response::json(['success' => true, 'id' => $id], 201);
    }

    public function delete(array $params): void {
        $id = (int) ($params['id'] ?? 0);
        if (!$this->service->delete($id)) Response::error('Image not found', 404);
        Response::json(['success' => true]);
    }

    public function toggle(array $params): void {
        $id     = (int) ($params['id'] ?? 0);
        $active = $this->service->toggleActive($id);
        if ($active === null) Response::error('Image not found', 404);
        Response::json(['success' => true, 'is_active' => $active]);
    }

    public function update(array $params): void {
        $id   = (int) ($params['id'] ?? 0);
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $this->service->update($id, $data['title'] ?? '', $data['category'] ?? '');
        Response::json(['success' => true]);
    }
}
