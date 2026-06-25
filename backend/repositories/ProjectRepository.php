<?php

class ProjectRepository {
    public function __construct(private mysqli $conn) {}

    private function normalize(array $row): array {
        $img = $row['image'];
        $row['image_url'] = $img
            ? (str_starts_with($img, 'uploads/') ? $img : 'uploads/projects/' . $img)
            : null;
        $due   = new DateTime($row['due_date'] ?: 'today');
        $today = new DateTime();
        $row['days_remaining'] = (int)$today->diff($due)->days;
        $row['is_overdue']     = $due < $today;
        return $row;
    }

    public function findById(int $id): ?array {
        $stmt = $this->conn->prepare("SELECT * FROM projects WHERE id = ? LIMIT 1");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        return $row ? $this->normalize($row) : null;
    }

    public function findAll(): array {
        $result = $this->conn->query("SELECT * FROM projects ORDER BY created_at DESC");
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $this->normalize($row);
        }
        return $rows;
    }

    public function create(array $data): int {
        $stmt = $this->conn->prepare(
            "INSERT INTO projects (name, description, status, due_date, duration, progress, image, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
        );
        $stmt->bind_param('sssssis',
            $data['name'], $data['description'], $data['status'],
            $data['due_date'], $data['duration'], $data['progress'], $data['image']
        );
        $stmt->execute();
        return (int) $this->conn->insert_id;
    }

    public function update(int $id, array $data): bool {
        $fields = ['name','description','status','due_date','duration','progress'];
        $sets   = implode(', ', array_map(fn($f) => "$f = ?", $fields));
        $types  = 'sssssi';
        $vals   = array_map(fn($f) => $data[$f], $fields);

        if (isset($data['image'])) {
            $sets  .= ', image = ?';
            $types .= 's';
            $vals[] = $data['image'];
        }

        $types .= 'i';
        $vals[] = $id;

        $stmt = $this->conn->prepare("UPDATE projects SET $sets WHERE id = ?");
        $stmt->bind_param($types, ...$vals);
        return $stmt->execute();
    }

    public function delete(int $id): ?string {
        $stmt = $this->conn->prepare("SELECT image FROM projects WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if (!$row) return null;

        $del = $this->conn->prepare("DELETE FROM projects WHERE id = ?");
        $del->bind_param('i', $id);
        $del->execute();
        return $row['image'] ?? '';
    }
}
