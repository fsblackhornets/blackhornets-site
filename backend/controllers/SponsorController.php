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

    public function adminIndex(array $params = []): void {
        $this->requireAdmin();
        $data = $this->service->getAll();
        Response::json(['success' => true, 'data' => $data, 'count' => count($data)]);
    }

    public function adminShow(array $params): void {
        $this->requireAdmin();
        $sponsor = $this->service->getById((int)$params['id']);
        if (!$sponsor) Response::error('Sponsor not found', 404);
        Response::json(['success' => true, 'data' => $sponsor]);
    }

    public function adminCreate(array $params = []): void {
        $this->requireAdmin();
        $body = $this->parseBody();
        foreach (['name','description','tier'] as $f) {
            if (empty($body[$f])) Response::error("Field '$f' is required.");
        }
        $data = [
            'name'           => trim($body['name']),
            'description'    => trim($body['description']),
            'description_en' => trim($body['description_en'] ?? ''),
            'tier'           => $body['tier'],
            'website'        => trim($body['website'] ?? ''),
            'tier_order'     => (int)($body['tier_order'] ?? 1),
        ];
        $file = $_FILES['logo'] ?? null;
        $id = $this->service->create($data, $file);
        Response::json(['success' => true, 'id' => $id], 201);
    }

    public function adminUpdate(array $params): void {
        $this->requireAdmin();
        $id   = (int)$params['id'];
        $body = $this->parseBody();
        foreach (['name','description','tier'] as $f) {
            if (empty($body[$f])) Response::error("Field '$f' is required.");
        }
        $data = [
            'name'           => trim($body['name']),
            'description'    => trim($body['description']),
            'description_en' => trim($body['description_en'] ?? ''),
            'tier'           => $body['tier'],
            'website'        => trim($body['website'] ?? ''),
            'tier_order'     => (int)($body['tier_order'] ?? 1),
        ];
        $file = $_FILES['logo'] ?? null;
        $this->service->update($id, $data, $file);
        Response::json(['success' => true]);
    }

    public function adminDelete(array $params): void {
        $this->requireAdmin();
        if (!$this->service->delete((int)$params['id'])) Response::error('Sponsor not found', 404);
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
