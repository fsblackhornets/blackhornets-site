<?php

class GalleryService {
    public function __construct(private GalleryRepository $repo) {}

    public function getAll(?string $category = null): array { return $this->repo->findAll($category); }
    public function getAllAdmin(): array                     { return $this->repo->findAllAdmin(); }
    public function delete(int $id): bool                   { return $this->repo->delete($id); }
    public function toggleActive(int $id): ?int             { return $this->repo->toggleActive($id); }
    public function update(int $id, string $title, string $category): void { $this->repo->update($id, $title, $category); }

    public function upload(array $file, string $category, string $title, int $userId): int {
        $allowed = ['jpg','jpeg','png','gif','webp'];
        $ext     = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed) || $file['size'] > 10 * 1024 * 1024) {
            throw new RuntimeException('Invalid file type or size.');
        }
        $uploadDir = __DIR__ . '/../../panel/admin/uploads/gallery/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        $filename  = uniqid('gallery_') . '.' . $ext;
        if (!move_uploaded_file($file['tmp_name'], $uploadDir . $filename)) {
            throw new RuntimeException('Failed to save file.');
        }
        $path = 'uploads/gallery/' . $filename;
        return $this->repo->create($path, $category, $title, $userId);
    }
}
