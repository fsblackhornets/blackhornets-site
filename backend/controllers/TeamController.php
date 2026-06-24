<?php

class TeamController {
    private TeamService $service;

    public function __construct(mysqli $conn) {
        $this->service = new TeamService(new TeamRepository($conn));
    }

    public function index(array $params = []): void {
        Response::json(['success' => true, ...$this->service->getAll()]);
    }
}
