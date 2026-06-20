<?php
ini_set('display_errors', 0);
if (session_status() === PHP_SESSION_NONE) session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require_once __DIR__ . '/../config/database.php';

if ($_SESSION['role'] !== 'manager' && $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$type = $_POST['type'] ?? null;
$valid_types = ['member', 'post', 'project', 'sponsor'];

if (!in_array($type, $valid_types)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request type']);
    exit;
}

$submitted_by = $_SESSION['user_id'];
$submitter_name = $_SESSION['full_name'] ?? 'Manager';

$data = [];

switch ($type) {
    case 'member':
        $data = [
            'full_name'     => trim($_POST['full_name'] ?? ''),
            'email'         => trim($_POST['email'] ?? ''),
            'phone'         => trim($_POST['phone'] ?? ''),
            'team'          => trim($_POST['team'] ?? ''),
            'department'    => trim($_POST['department'] ?? ''),
            'role'          => trim($_POST['role'] ?? 'team_member'),
            'position'      => trim($_POST['position'] ?? ''),
            'faculty'       => trim($_POST['faculty'] ?? ''),
            'study_field'   => trim($_POST['study_field'] ?? ''),
            'academic_year' => trim($_POST['academic_year'] ?? ''),
        ];
        if (empty($data['full_name']) || empty($data['email']) || empty($data['team'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Full name, email and team are required']);
            exit;
        }

        // Handle profile picture upload
        if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = __DIR__ . '/../../../uploads/profiles/';
            $ext = strtolower(pathinfo($_FILES['profile_picture']['name'], PATHINFO_EXTENSION));
            $allowed = ['jpg', 'jpeg', 'png', 'gif'];
            if (in_array($ext, $allowed) && $_FILES['profile_picture']['size'] <= 5 * 1024 * 1024) {
                $filename = uniqid('pending_') . '.' . $ext;
                if (move_uploaded_file($_FILES['profile_picture']['tmp_name'], $upload_dir . $filename)) {
                    $data['profile_picture'] = $filename;
                }
            }
        }
        break;

    case 'post':
        $data = [
            'title_sr'   => trim($_POST['title_sr'] ?? ''),
            'title_en'   => trim($_POST['title_en'] ?? ''),
            'content_sr' => trim($_POST['content_sr'] ?? ''),
            'content_en' => trim($_POST['content_en'] ?? ''),
            'featured'   => isset($_POST['featured']) ? 1 : 0,
            'category'   => trim($_POST['category'] ?? ''),
        ];
        if (empty($data['title_sr']) || empty($data['content_sr'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Title and content (SR) are required']);
            exit;
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = __DIR__ . '/../../../uploads/blog-images/';
            $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif']) && $_FILES['image']['size'] <= 5 * 1024 * 1024) {
                $filename = uniqid('pending_post_') . '.' . $ext;
                if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $filename)) {
                    $data['image'] = $filename;
                }
            }
        }
        break;

    case 'project':
        $data = [
            'name'        => trim($_POST['name'] ?? ''),
            'description' => trim($_POST['description'] ?? ''),
            'status'      => trim($_POST['status'] ?? 'pending'),
            'progress'    => (int)($_POST['progress'] ?? 0),
            'due_date'    => trim($_POST['due_date'] ?? ''),
            'duration'    => trim($_POST['duration'] ?? ''),
        ];
        if (empty($data['name']) || empty($data['description'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and description are required']);
            exit;
        }

        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = __DIR__ . '/../../../uploads/projects/';
            $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif']) && $_FILES['image']['size'] <= 5 * 1024 * 1024) {
                $filename = uniqid('pending_proj_') . '.' . $ext;
                if (move_uploaded_file($_FILES['image']['tmp_name'], $upload_dir . $filename)) {
                    $data['image_url'] = 'uploads/projects/' . $filename;
                }
            }
        }
        break;

    case 'sponsor':
        $data = [
            'name'           => trim($_POST['name'] ?? ''),
            'tier'           => trim($_POST['tier'] ?? ''),
            'website'        => trim($_POST['website'] ?? ''),
            'description_sr' => trim($_POST['description_sr'] ?? ''),
            'description_en' => trim($_POST['description_en'] ?? ''),
        ];
        if (empty($data['name']) || empty($data['tier'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and tier are required']);
            exit;
        }

        if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = __DIR__ . '/../../../uploads/sponsors/';
            $ext = strtolower(pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp']) && $_FILES['logo']['size'] <= 5 * 1024 * 1024) {
                $filename = uniqid('pending_sponsor_') . '.' . $ext;
                if (move_uploaded_file($_FILES['logo']['tmp_name'], $upload_dir . $filename)) {
                    $data['logo'] = $filename;
                }
            }
        }
        break;
}

$json_data = json_encode($data);

$stmt = $conn->prepare("
    INSERT INTO content_requests (type, data, submitted_by, submitter_name, status, created_at)
    VALUES (?, ?, ?, ?, 'pending', NOW())
");
$stmt->bind_param('ssis', $type, $json_data, $submitted_by, $submitter_name);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Request submitted successfully. Awaiting admin approval.', 'id' => $conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to submit request: ' . $stmt->error]);
}

$stmt->close();
