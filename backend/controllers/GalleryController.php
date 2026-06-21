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
}
