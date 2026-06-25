<?php

class AdminController {
    public function __construct(private mysqli $conn) {}

    public function stats(array $params = []): void {
        $pending_applications = (int) $this->conn
            ->query("SELECT COUNT(*) c FROM applications WHERE status='pending'")
            ->fetch_assoc()['c'];

        $total_messages = (int) $this->conn
            ->query("SELECT COUNT(*) c FROM contact_messages")
            ->fetch_assoc()['c'];

        $pending_requests = (int) $this->conn
            ->query("SELECT COUNT(*) c FROM content_requests WHERE status='pending'")
            ->fetch_assoc()['c'];

        $result = $this->conn->query(
            "SELECT team, COUNT(*) c FROM users
             WHERE status='active' AND role NOT IN ('admin','manager')
             GROUP BY team"
        );
        $by_team = ['mechanical' => 0, 'electrical' => 0, 'operating_business' => 0];
        $total   = 0;
        while ($row = $result->fetch_assoc()) {
            $by_team[$row['team']] = (int) $row['c'];
            $total += (int) $row['c'];
        }

        Response::json([
            'pending_applications' => $pending_applications,
            'total_messages'       => $total_messages,
            'pending_requests'     => $pending_requests,
            'team_members'         => [
                'total'      => $total,
                'mechanical' => $by_team['mechanical'],
                'electrical' => $by_team['electrical'],
                'business'   => $by_team['operating_business'],
            ],
        ]);
    }

    public function messages(array $params = []): void {
        $page   = max(1, (int) ($_GET['page'] ?? 1));
        $limit  = 10;
        $offset = ($page - 1) * $limit;

        $total = (int) $this->conn
            ->query("SELECT COUNT(*) c FROM contact_messages")
            ->fetch_assoc()['c'];

        $stmt = $this->conn->prepare(
            "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ? OFFSET ?"
        );
        $stmt->bind_param('ii', $limit, $offset);
        $stmt->execute();
        $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

        Response::json([
            'data'        => $rows,
            'total'       => $total,
            'page'        => $page,
            'total_pages' => max(1, (int) ceil($total / $limit)),
        ]);
    }

    public function deleteMessage(array $params): void {
        $id   = (int) ($params['id'] ?? 0);
        $stmt = $this->conn->prepare("DELETE FROM contact_messages WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();

        if ($stmt->affected_rows === 0) Response::error('Message not found', 404);

        Response::json(['success' => true, 'message' => 'Message deleted']);
    }
}
