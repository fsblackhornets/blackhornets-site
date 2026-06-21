<?php

class PostService {
    public function __construct(private PostRepository $repo) {}

    public function getAll(): array         { return $this->repo->findAll(); }
    public function getById(int $id): ?array { return $this->repo->findById($id); }
    public function getCategories(): array  { return $this->repo->findCategories(); }

    public function create(array $data, string $author): int {
        return $this->repo->create([
            'title'       => $data['title_sr'] ?? '',
            'title_sr'    => $data['title_sr'] ?? '',
            'title_en'    => $data['title_en'] ?? '',
            'content'     => $data['content_sr'] ?? '',
            'content_sr'  => $data['content_sr'] ?? '',
            'content_en'  => $data['content_en'] ?? '',
            'author'      => $author,
            'category'    => $data['category'] ?? '',
            'featured'    => (int)($data['featured'] ?? 0),
            'image'       => $data['image'] ?? '',
        ]);
    }
}
