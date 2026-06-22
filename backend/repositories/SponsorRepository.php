<?php

class SponsorRepository {
    public function __construct(private mysqli $conn) {}

    public function findAll(): array {
        $result = $this->conn->query("SELECT * FROM sponsors ORDER BY tier_order ASC, created_at DESC");
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $logo = $row['logo'];
            $row['logo_url'] = $logo
                ? (str_starts_with($logo, 'uploads/') ? $logo : 'admin/uploads/sponsors/' . $logo)
                : null;
            $rows[] = $row;
        }
        return $rows;
    }
}
