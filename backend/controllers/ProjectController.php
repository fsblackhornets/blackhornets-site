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
}
