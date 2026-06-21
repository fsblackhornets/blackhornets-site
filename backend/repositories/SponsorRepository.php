<?php

class SponsorRepository {
    public function __construct(private mysqli $conn) {}

    public function findAll(): array {
        $result = $this->conn->query("SELECT * FROM sponsors ORDER BY tier_order ASC, created_at DESC");
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $row['logo_url'] = $row['logo'] ? 'admin/uploads/sponsors/' . $row['logo'] : null;
            $rows[] = $row;
        }
        return $rows;
    }
}
