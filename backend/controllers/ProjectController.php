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
}
