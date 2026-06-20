<?php
ini_set('display_errors', 0);
if (session_status() === PHP_SESSION_NONE) session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';

if ($_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Admin only']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id          = (int)($input['id'] ?? 0);
$action      = $input['action'] ?? '';   // 'approve' or 'decline'
$admin_notes = trim($input['notes'] ?? '');
$reviewed_by = $_SESSION['user_id'];

if (!$id || !in_array($action, ['approve', 'decline'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid parameters']);
    exit;
}

// Fetch the request
$stmt = $conn->prepare("SELECT * FROM content_requests WHERE id = ? AND status = 'pending'");
$stmt->bind_param('i', $id);
$stmt->execute();
$request = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$request) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Request not found or already reviewed']);
    exit;
}

$new_status = $action === 'approve' ? 'approved' : 'declined';

$conn->begin_transaction();

try {
    // Update request status
    $upd = $conn->prepare("
        UPDATE content_requests
        SET status = ?, admin_notes = ?, reviewed_by = ?, reviewed_at = NOW()
        WHERE id = ?
    ");
    $upd->bind_param('ssii', $new_status, $admin_notes, $reviewed_by, $id);
    $upd->execute();
    $upd->close();

    // On approve — insert into the appropriate table
    if ($action === 'approve') {
        $data = json_decode($request['data'], true);
        $type = $request['type'];

        switch ($type) {
            case 'member':
                // Insert into users table
                $base_username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '_', $data['full_name']));
                $base_username = preg_replace('/_+/', '_', trim($base_username, '_'));
                $username = $base_username;
                $suffix = 1;
                $ck = $conn->prepare("SELECT id FROM users WHERE username = ?");
                $ck->bind_param('s', $username);
                $ck->execute();
                while ($ck->get_result()->num_rows > 0) {
                    $username = $base_username . '_' . $suffix++;
                    $ck->bind_param('s', $username);
                    $ck->execute();
                }
                $ck->close();

                $random_password = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
                $role_val = $data['role'];
                $ins_user = $conn->prepare("
                    INSERT INTO users (username, password, email, full_name, role, team, department, phone, status, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())
                ");
                $ins_user->bind_param('ssssssss',
                    $username, $random_password, $data['email'], $data['full_name'],
                    $role_val, $data['team'], $data['department'], $data['phone']
                );
                $ins_user->execute();
                $new_user_id = $conn->insert_id;
                $ins_user->close();

                $pic = $data['profile_picture'] ?? 'default.jpg';
                $ins_member = $conn->prepare("
                    INSERT INTO team_members (user_id, position, profile_picture, faculty, study_field, academic_year, department, team, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
                ");
                $ins_member->bind_param('isssssss',
                    $new_user_id, $data['position'], $pic,
                    $data['faculty'], $data['study_field'], $data['academic_year'],
                    $data['department'], $data['team']
                );
                $ins_member->execute();
                $ins_member->close();
                break;

            case 'post':
                $author = $request['submitter_name'];
                $ins_post = $conn->prepare("
                    INSERT INTO posts (title, title_sr, title_en, content, content_sr, content_en, author, category, featured, image, status, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW())
                ");
                $title    = $data['title_sr'];
                $content  = $data['content_sr'];
                $featured = (int)($data['featured'] ?? 0);
                $image    = $data['image'] ?? '';
                $category = $data['category'] ?? '';
                $ins_post->bind_param('ssssssssis',
                    $title, $data['title_sr'], $data['title_en'],
                    $content, $data['content_sr'], $data['content_en'],
                    $author, $category, $featured, $image
                );
                $ins_post->execute();
                $ins_post->close();
                break;

            case 'project':
                $progress = (int)($data['progress'] ?? 0);
                $ins_proj = $conn->prepare("
                    INSERT INTO projects (name, description, status, progress, due_date, duration, image_url, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
                ");
                $ins_proj->bind_param('sssisss',
                    $data['name'], $data['description'], $data['status'],
                    $progress, $data['due_date'], $data['duration'], $data['image_url'] ?? ''
                );
                $ins_proj->execute();
                $ins_proj->close();
                break;

            case 'sponsor':
                $ins_spon = $conn->prepare("
                    INSERT INTO sponsors (name, tier, website, description, description_sr, description_en, logo, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
                ");
                $desc = $data['description_sr'];
                $logo = $data['logo'] ?? '';
                $ins_spon->bind_param('sssssss',
                    $data['name'], $data['tier'], $data['website'],
                    $desc, $data['description_sr'], $data['description_en'], $logo
                );
                $ins_spon->execute();
                $ins_spon->close();
                break;
        }
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => ucfirst($new_status) . ' successfully']);

} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
