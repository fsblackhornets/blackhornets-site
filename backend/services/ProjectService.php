<?php

class ProjectService {
    public function __construct(private ProjectRepository $repo) {}
    public function getAll(): array  { return $this->repo->findAll(); }
    public function getById(int $id): ?array { return $this->repo->findById($id); }
}
