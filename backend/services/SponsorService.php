<?php

class SponsorService {
    public function __construct(private SponsorRepository $repo) {}

    public function getAll(): array           { return $this->repo->findAll(); }
    public function getById(int $id): ?array  { return $this->repo->findById($id); }

    public function create(array $data, ?array $file = null): int {
        $data['logo'] = $this->handleUpload($file) ?? '';
        return $this->repo->create($data);
    }

    public function update(int $id, array $data, ?array $file = null): bool {
        $newLogo = $this->handleUpload($file);
        if ($newLogo !== null) $data['logo'] = $newLogo;
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): bool {
        $logo = $this->repo->delete($id);
        if ($logo === null) return false;
        if ($logo) {
            $path = __DIR__ . '/../../panel/admin/' . $logo;
            if (file_exists($path)) unlink($path);
        }
        return true;
    }

    private function handleUpload(?array $file): ?string {
        if (!$file || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            return null;
        }
        $allowed = ['jpg','jpeg','png','gif','webp','svg'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed) || $file['size'] > 5 * 1024 * 1024) {
            throw new RuntimeException('Invalid file type or size.');
        }
        $dir = __DIR__ . '/../../panel/admin/uploads/sponsors/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $filename = uniqid('sponsor_') . '.' . $ext;
        if (!move_uploaded_file($file['tmp_name'], $dir . $filename)) {
            throw new RuntimeException('Failed to save file.');
        }
        return 'uploads/sponsors/' . $filename;
    }
}
