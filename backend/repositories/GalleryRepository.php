<?php

class GalleryRepository {
    public function __construct(private mysqli $conn) {}

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
