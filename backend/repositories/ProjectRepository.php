<?php

class ProjectRepository {
    public function __construct(private mysqli $conn) {}

    public function findById(int $id): ?array {
        $stmt = $this->conn->prepare("SELECT * FROM projects WHERE id = ? LIMIT 1");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if (!$row) return null;
        $img = $row['image'];
        $row['image_url'] = $img
            ? (str_starts_with($img, 'uploads/') ? $img : 'admin/uploads/projects/' . $img)
            : null;
        $due   = new DateTime($row['due_date'] ?: 'today');
        $today = new DateTime();
        $row['days_remaining'] = (int)$today->diff($due)->days;
        $row['is_overdue']     = $due < $today;
        return $row;
    }

    public function findAll(): array {
        $result = $this->conn->query("SELECT * FROM projects ORDER BY created_at DESC");
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $img = $row['image'];
            $row['image_url'] = $img
                ? (str_starts_with($img, 'uploads/') ? $img : 'admin/uploads/projects/' . $img)
                : null;
            $due   = new DateTime($row['due_date']);
            $today = new DateTime();
            $row['days_remaining'] = (int)$today->diff($due)->days;
            $row['is_overdue']     = $due < $today;
            $rows[] = $row;
        }
        return $rows;
    }
}
