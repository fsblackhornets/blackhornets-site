<?php

class ProjectService {
    public function __construct(private ProjectRepository $repo) {}

    public function getAll(): array           { return $this->repo->findAll(); }
    public function getById(int $id): ?array  { return $this->repo->findById($id); }

    public function create(array $data, ?array $file = null): int {
        $data['image'] = $this->handleUpload($file, null);
        return $this->repo->create($data);
    }

    public function update(int $id, array $data, ?array $file = null): bool {
        $newImage = $this->handleUpload($file, null);
        if ($newImage !== null) $data['image'] = $newImage;
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): bool {
        $image = $this->repo->delete($id);
        if ($image === null) return false;
        if ($image) {
            $path = __DIR__ . '/../../panel/admin/' . $image;
            if (file_exists($path)) unlink($path);
        }
        return true;
    }

    private function handleUpload(?array $file, ?string $existing): ?string {
        if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            return null;
        }
        $allowed = ['jpg','jpeg','png','gif','webp'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed) || $file['size'] > 5 * 1024 * 1024) {
            throw new RuntimeException('Invalid file type or size.');
        }
        $dir = __DIR__ . '/../../panel/admin/uploads/projects/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $filename = uniqid('project_') . '.' . $ext;
        if (!move_uploaded_file($file['tmp_name'], $dir . $filename)) {
            throw new RuntimeException('Failed to save file.');
        }
        return 'uploads/projects/' . $filename;
    }
}
