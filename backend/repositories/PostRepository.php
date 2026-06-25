<?php

class PostRepository {
    public function __construct(private mysqli $conn) {}

    public function findAll(): array {
        $result = $this->conn->query("SELECT * FROM posts ORDER BY created_at DESC");
        $rows = [];
        while ($row = $result->fetch_assoc()) $rows[] = $row;
        return $rows;
    }

    public function findById(int $id): ?array {
        $stmt = $this->conn->prepare("SELECT * FROM posts WHERE id = ? LIMIT 1");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc() ?: null;
    }

    public function findCategories(): array {
        $result = $this->conn->query("SELECT category, COUNT(*) AS count FROM posts WHERE category IS NOT NULL AND category != '' GROUP BY category ORDER BY count DESC");
        $rows = [];
        while ($row = $result->fetch_assoc()) $rows[] = $row;
        return $rows;
    }

    public function create(array $data): int {
        $stmt = $this->conn->prepare("
            INSERT INTO posts (title, title_sr, title_en, content, content_sr, content_en, author, category, featured, image, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW())
        ");
        $stmt->bind_param('ssssssssis',
            $data['title'], $data['title_sr'], $data['title_en'],
            $data['content'], $data['content_sr'], $data['content_en'],
            $data['author'], $data['category'], $data['featured'], $data['image']
        );
        $stmt->execute();
        return $this->conn->insert_id;
    }

    public function update(int $id, array $data): void {
        $stmt = $this->conn->prepare("
            UPDATE posts SET
                title_sr=?, title_en=?, content_sr=?, content_en=?,
                category=?, author=?, featured=?, status=?, updated_at=NOW()
            WHERE id=?
        ");
        $stmt->bind_param('ssssssiis',
            $data['title_sr'], $data['title_en'],
            $data['content_sr'], $data['content_en'],
            $data['category'], $data['author'],
            $data['featured'], $data['status'], $id
        );
        $stmt->execute();
    }

    public function delete(int $id): bool {
        $stmt = $this->conn->prepare("DELETE FROM posts WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        return $stmt->affected_rows > 0;
    }

    public function toggleStatus(int $id): string {
        $row = $this->findById($id);
        if (!$row) return '';
        $next = $row['status'] === 'published' ? 'draft' : 'published';
        $stmt = $this->conn->prepare("UPDATE posts SET status=?, updated_at=NOW() WHERE id=?");
        $stmt->bind_param('si', $next, $id);
        $stmt->execute();
        return $next;
    }
}
