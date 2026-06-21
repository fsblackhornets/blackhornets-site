<?php

class SponsorController {
    private SponsorService $service;

    public function __construct(mysqli $conn) {
        $this->service = new SponsorService(new SponsorRepository($conn));
    }

    public function index(array $params = []): void {
        $data = $this->service->getAll();
        Response::json(['success' => true, 'data' => $data, 'count' => count($data)]);
    }
}
