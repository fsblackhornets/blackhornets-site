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

    public function applications(array $params = []): void {
        $status = $_GET['status'] ?? '';
        $page   = max(1, (int) ($_GET['page'] ?? 1));
        $limit  = 10;
        $offset = ($page - 1) * $limit;

        $where = $status && in_array($status, ['pending', 'reviewing', 'accepted', 'rejected'])
            ? "WHERE status = '$status'" : '';

        $total = (int) $this->conn
            ->query("SELECT COUNT(*) c FROM applications $where")
            ->fetch_assoc()['c'];

        $stmt = $this->conn->prepare(
            "SELECT * FROM applications $where ORDER BY created_at DESC LIMIT ? OFFSET ?"
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

    public function applicationDetail(array $params): void {
        $id   = (int) ($params['id'] ?? 0);
        $stmt = $this->conn->prepare("SELECT * FROM applications WHERE id = ?");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row  = $stmt->get_result()->fetch_assoc();
        if (!$row) Response::error('Application not found', 404);
        Response::json(['data' => $row]);
    }

    public function reviewApplication(array $params): void {
        $id   = (int) ($params['id'] ?? 0);
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $action = $data['action'] ?? '';

        if (!$id || !in_array($action, ['accept', 'reject', 'review'])) {
            Response::error('Invalid parameters', 400);
        }

        $status = match ($action) {
            'accept' => 'accepted',
            'reject' => 'rejected',
            'review' => 'reviewing',
        };

        $stmt = $this->conn->prepare("UPDATE applications SET status = ? WHERE id = ?");
        $stmt->bind_param('si', $status, $id);
        if (!$stmt->execute()) Response::error('Update failed', 500);

        if ($action === 'accept') {
            $row = $this->conn->prepare(
                "SELECT first_name, last_name, email, desired_position FROM applications WHERE id = ?"
            );
            $row->bind_param('i', $id);
            $row->execute();
            $applicant = $row->get_result()->fetch_assoc();

            if ($applicant) {
                $name     = trim($applicant['first_name'] . ' ' . $applicant['last_name']);
                $position = $applicant['desired_position'] ?? 'team member';
                $body     = "Dear {$name},\n\nYour application for the position of {$position} has been APPROVED!\n\nWe will contact you shortly with next steps.\n\nBest regards,\nBlack Hornets Racing Team";
                if (function_exists('sendEmail')) {
                    sendEmail($applicant['email'], $name, 'Black Hornets Racing — Application Approved!', $body);
                }
            }
        }

        Response::json(['success' => true, 'status' => $status]);
    }

    // ─── Members ───
    public function members(array $params = []): void {
        $result = $this->conn->query(
            "SELECT id, username, email, full_name, role, team, department,
                    phone, study_field, position, profile_picture, status, created_at
             FROM users WHERE role != 'admin' ORDER BY full_name ASC"
        );
        Response::json(['data' => $result->fetch_all(MYSQLI_ASSOC)]);
    }

    public function memberDetail(array $params): void {
        $id   = (int) ($params['id'] ?? 0);
        $stmt = $this->conn->prepare(
            "SELECT id, username, email, full_name, role, team, department,
                    phone, study_field, position, profile_picture, status, created_at
             FROM users WHERE id = ? LIMIT 1"
        );
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if (!$row) Response::error('Member not found', 404);
        Response::json(['data' => $row]);
    }

    public function createMember(array $params = []): void {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $required = ['username', 'password', 'email', 'full_name'];
        foreach ($required as $f) {
            if (empty($data[$f])) Response::error("$f is required", 400);
        }

        $hash = password_hash($data['password'], PASSWORD_BCRYPT);
        $stmt = $this->conn->prepare(
            "INSERT INTO users (username, password, email, full_name, role, team, department, phone, study_field, position, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')"
        );
        $role  = $data['role']       ?? 'team_member';
        $team  = $data['team']       ?? null;
        $dept  = $data['department'] ?? null;
        $phone = $data['phone']      ?? null;
        $study = $data['study_field'] ?? null;
        $pos   = $data['position']   ?? null;
        $stmt->bind_param('ssssssssss',
            $data['username'], $hash, $data['email'], $data['full_name'],
            $role, $team, $dept, $phone, $study, $pos
        );
        if (!$stmt->execute()) Response::error('Username already taken', 409);
        Response::json(['success' => true, 'id' => $this->conn->insert_id], 201);
    }

    public function updateMember(array $params): void {
        $id   = (int) ($params['id'] ?? 0);
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $stmt = $this->conn->prepare(
            "UPDATE users SET email=?, full_name=?, role=?, team=?, department=?,
                              phone=?, study_field=?, position=?
             WHERE id=? AND role != 'admin'"
        );
        $role  = $data['role']        ?? 'team_member';
        $team  = $data['team']        ?? null;
        $dept  = $data['department']  ?? null;
        $phone = $data['phone']       ?? null;
        $study = $data['study_field'] ?? null;
        $pos   = $data['position']    ?? null;
        $stmt->bind_param('ssssssssi',
            $data['email'], $data['full_name'], $role, $team, $dept, $phone, $study, $pos, $id
        );
        $stmt->execute();
        Response::json(['success' => true]);
    }

    public function deleteMember(array $params): void {
        $id   = (int) ($params['id'] ?? 0);
        $stmt = $this->conn->prepare("DELETE FROM users WHERE id = ? AND role != 'admin'");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        if ($stmt->affected_rows === 0) Response::error('Member not found', 404);
        Response::json(['success' => true]);
    }

    public function toggleMemberStatus(array $params): void {
        $id   = (int) ($params['id'] ?? 0);
        $stmt = $this->conn->prepare(
            "UPDATE users SET status = IF(status='active','inactive','active')
             WHERE id = ? AND role != 'admin'"
        );
        $stmt->bind_param('i', $id);
        $stmt->execute();
        if ($stmt->affected_rows === 0) Response::error('Member not found', 404);

        $row = $this->conn->prepare("SELECT status FROM users WHERE id = ?");
        $row->bind_param('i', $id);
        $row->execute();
        $status = $row->get_result()->fetch_assoc()['status'];
        Response::json(['success' => true, 'status' => $status]);
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
