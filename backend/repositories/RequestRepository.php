<?php

class RequestRepository {
    public function __construct(private mysqli $conn) {}

    public function create(string $type, string $jsonData, int $userId, string $submitterName): int {
        $stmt = $this->conn->prepare("
            INSERT INTO content_requests (type, data, submitted_by, submitter_name, status, created_at)
            VALUES (?, ?, ?, ?, 'pending', NOW())
        ");
        $stmt->bind_param('ssis', $type, $jsonData, $userId, $submitterName);
        $stmt->execute();
        return $this->conn->insert_id;
    }

    public function findAll(?string $status = null, ?string $type = null, ?int $userId = null): array {
        $where = []; $params = []; $types = '';

        if ($userId) { $where[] = 'submitted_by = ?'; $params[] = $userId; $types .= 'i'; }
        if ($status && $status !== 'all') { $where[] = 'status = ?'; $params[] = $status; $types .= 's'; }
        if ($type   && $type   !== 'all') { $where[] = 'type = ?';   $params[] = $type;   $types .= 's'; }

        $sql = 'SELECT * FROM content_requests' . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY created_at DESC';
        $stmt = $this->conn->prepare($sql);
        if ($params) $stmt->bind_param($types, ...$params);
        $stmt->execute();

        $result = $stmt->get_result();
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $row['data'] = json_decode($row['data'], true);
            $rows[] = $row;
        }
        return $rows;
    }

    public function findById(int $id): ?array {
        $stmt = $this->conn->prepare("SELECT * FROM content_requests WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if ($row) $row['data'] = json_decode($row['data'], true);
        return $row ?: null;
    }

    public function findPendingById(int $id): ?array {
        $stmt = $this->conn->prepare("SELECT * FROM content_requests WHERE id = ? AND status = 'pending'");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if ($row) $row['data'] = json_decode($row['data'], true);
        return $row ?: null;
    }

    public function updateData(int $id, string $jsonData): void {
        $stmt = $this->conn->prepare("UPDATE content_requests SET data = ? WHERE id = ?");
        $stmt->bind_param('si', $jsonData, $id);
        $stmt->execute();
    }

    public function markReviewed(int $id, string $status, ?string $notes, int $reviewedBy): void {
        $stmt = $this->conn->prepare("UPDATE content_requests SET status=?, admin_notes=?, reviewed_by=?, reviewed_at=NOW() WHERE id=?");
        $stmt->bind_param('ssii', $status, $notes, $reviewedBy, $id);
        $stmt->execute();
    }
}
