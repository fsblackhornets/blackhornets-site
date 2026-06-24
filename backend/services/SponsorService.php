<?php

class SponsorService {
    public function __construct(private SponsorRepository $repo) {}
    public function getAll(): array { return $this->repo->findAll(); }
}
