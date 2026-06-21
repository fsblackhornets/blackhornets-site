<?php

class GalleryService {
    public function __construct(private GalleryRepository $repo) {}
    public function getAll(?string $category = null): array { return $this->repo->findAll($category); }
}
