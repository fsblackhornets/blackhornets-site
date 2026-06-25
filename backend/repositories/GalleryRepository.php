<?php

class GalleryRepository {
    public function __construct(private mysqli $conn) {}

    public function create(string $imagePath, string $category, string $title, int $userId): int {
        $stmt = $this->conn->prepare("INSERT INTO gallery_images (title, image_path, category, is_active, created_by, created_at) VALUES (?, ?, ?, 1, ?, NOW())");
        $stmt->bind_param('sssi', $title, $imagePath, $category, $userId);
        $stmt->execute();
        return $this->conn->insert_id;
    }

    public function findAll(?string $category = null): array {
        $sql = "SELECT * FROM gallery_images WHERE is_active = 1";
        if ($category) {
            $stmt = $this->conn->prepare($sql . " AND category = ? ORDER BY category, sort_order, created_at DESC");
            $stmt->bind_param('s', $category);
            $stmt->execute();
            $result = $stmt->get_result();
        } else {
            $result = $this->conn->query($sql . " ORDER BY category, sort_order, created_at DESC");
        }
        $rows = [];
        while ($row = $result->fetch_assoc()) $rows[] = $row;
        return $rows;
    }

    public function findAllAdmin(): array {
        $result = $this->conn->query(
            "SELECT * FROM gallery_images ORDER BY category, sort_order, created_at DESC"
        );
        $rows = [];
        while ($row = $result->fetch_assoc()) $rows[] = $row;
        return $rows;
    }

    public function delete(int $id): bool {
        $stmt = $this->conn->prepare("DELETE FROM gallery_images WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        return $stmt->affected_rows > 0;
    }

    public function toggleActive(int $id): ?int {
        $stmt = $this->conn->prepare(
            "UPDATE gallery_images SET is_active = IF(is_active=1,0,1) WHERE id = ?"
        );
        $stmt->bind_param('i', $id);
        $stmt->execute();
        if ($stmt->affected_rows === 0) return null;
        $row = $this->conn->prepare("SELECT is_active FROM gallery_images WHERE id = ?");
        $row->bind_param('i', $id);
        $row->execute();
        return (int) $row->get_result()->fetch_assoc()['is_active'];
    }

    public function update(int $id, string $title, string $category): void {
        $stmt = $this->conn->prepare(
            "UPDATE gallery_images SET title=?, category=? WHERE id=?"
        );
        $stmt->bind_param('ssi', $title, $category, $id);
        $stmt->execute();
    }
}
