<?php

class ProjectRepository {
    public function __construct(private mysqli $conn) {}

    public function findAll(): array {
        $result = $this->conn->query("SELECT * FROM projects ORDER BY created_at DESC");
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $row['image_url'] = $row['image'] ? 'admin/uploads/projects/' . $row['image'] : null;
            $due   = new DateTime($row['due_date']);
            $today = new DateTime();
            $row['days_remaining'] = (int)$today->diff($due)->days;
            $row['is_overdue']     = $due < $today;
            $rows[] = $row;
        }
        return $rows;
    }
}
