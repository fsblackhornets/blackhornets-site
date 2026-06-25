<?php

class ProjectController {
    private ProjectService $service;

    public function __construct(mysqli $conn) {
        $this->service = new ProjectService(new ProjectRepository($conn));
    }

    public function index(array $params = []): void {
        $data = $this->service->getAll();
        Response::json(['success' => true, 'data' => $data, 'count' => count($data)]);
    }

    public function show(array $params): void {
        $project = $this->service->getById((int)$params['id']);
        if (!$project) Response::error('Project not found', 404);
        Response::json(['success' => true, 'data' => $project]);
    }

    public function adminIndex(array $params = []): void {
        $this->requireAdmin();
        $data = $this->service->getAll();
        Response::json(['success' => true, 'data' => $data, 'count' => count($data)]);
    }

    public function adminShow(array $params): void {
        $this->requireAdmin();
        $project = $this->service->getById((int)$params['id']);
        if (!$project) Response::error('Project not found', 404);
        Response::json(['success' => true, 'data' => $project]);
    }

    public function adminCreate(array $params = []): void {
        $this->requireAdmin();
        $body = $this->parseBody();
        $required = ['name','status','due_date','duration'];
        foreach ($required as $field) {
            if (empty($body[$field])) Response::error("Field '$field' is required.");
        }
        $data = [
            'name'        => trim($body['name']),
            'description' => trim($body['description'] ?? ''),
            'status'      => $body['status'],
            'due_date'    => $body['due_date'],
            'duration'    => trim($body['duration']),
            'progress'    => (int)($body['progress'] ?? 0),
        ];
        $file = $_FILES['image'] ?? null;
        $id = $this->service->create($data, $file);
        Response::json(['success' => true, 'id' => $id], 201);
    }

    public function adminUpdate(array $params): void {
        $this->requireAdmin();
        $id   = (int)$params['id'];
        $body = $this->parseBody();
        $required = ['name','status','due_date','duration'];
        foreach ($required as $field) {
            if (empty($body[$field])) Response::error("Field '$field' is required.");
        }
        $data = [
            'name'        => trim($body['name']),
            'description' => trim($body['description'] ?? ''),
            'status'      => $body['status'],
            'due_date'    => $body['due_date'],
            'duration'    => trim($body['duration']),
            'progress'    => (int)($body['progress'] ?? 0),
        ];
        $file = $_FILES['image'] ?? null;
        $this->service->update($id, $data, $file);
        Response::json(['success' => true]);
    }

    public function adminDelete(array $params): void {
        $this->requireAdmin();
        if (!$this->service->delete((int)$params['id'])) Response::error('Project not found', 404);
        Response::json(['success' => true]);
    }

    private function requireAdmin(): void {
        if (($_SESSION['role'] ?? '') !== 'admin') Response::forbidden();
    }

    private function parseBody(): array {
        $ct = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($ct, 'application/json')) {
            return json_decode(file_get_contents('php://input'), true) ?? [];
        }
        return $_POST;
    }
}
