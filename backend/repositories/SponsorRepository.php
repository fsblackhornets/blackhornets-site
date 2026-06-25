<?php

class SponsorRepository {
    public function __construct(private mysqli $conn) {}

    private function normalize(array $row): array {
        $logo = $row['logo'];
        $row['logo_url'] = $logo
            ? (str_starts_with($logo, 'uploads/') ? $logo : 'uploads/sponsors/' . $logo)
            : null;
        return $row;
    }

    public function findAll(): array {
        $result = $this->conn->query("SELECT * FROM sponsors ORDER BY tier_order ASC, created_at DESC");
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $this->normalize($row);
        }
        return $rows;
    }

    public function findById(int $id): ?array {
        $stmt = $this->conn->prepare("SELECT * FROM sponsors WHERE id = ? LIMIT 1");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        return $row ? $this->normalize($row) : null;
    }

    public function create(array $data): int {
        $stmt = $this->conn->prepare(
            "INSERT INTO sponsors (name, description, description_en, tier, website, tier_order, logo, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
        );
        $stmt->bind_param('sssssis',
            $data['name'], $data['description'], $data['description_en'],
            $data['tier'], $data['website'], $data['tier_order'], $data['logo']
        );
        $stmt->execute();
        return (int) $this->conn->insert_id;
    }

    public function update(int $id, array $data): bool {
        $fields = ['name','description','description_en','tier','website','tier_order'];
        $sets   = implode(', ', array_map(fn($f) => "$f = ?", $fields));
        $types  = 'sssssi';
        $vals   = array_map(fn($f) => $data[$f], $fields);

        if (isset($data['logo'])) {
            $sets  .= ', logo = ?';
            $types .= 's';
            $vals[] = $data['logo'];
        }

        $types .= 'i';
        $vals[] = $id;

        $stmt = $this->conn->prepare("UPDATE sponsors SET $sets WHERE id = ?");
        $stmt->bind_param($types, ...$vals);
        return $stmt->execute();
    }

    public function delete(int $id): ?string {
        $stmt = $this->conn->prepare("SELECT logo FROM sponsors WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if (!$row) return null;

        $del = $this->conn->prepare("DELETE FROM sponsors WHERE id = ?");
        $del->bind_param('i', $id);
        $del->execute();
        return $row['logo'] ?? '';
    }
}
