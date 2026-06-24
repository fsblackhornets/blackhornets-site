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
}
