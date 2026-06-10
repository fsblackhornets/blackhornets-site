<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');

// Authentication check — only logged-in admins can create/edit posts
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

require_once '../../../src/config/database.php';
require_once '../../../src/utils/Translator.php';
require_once '../../../src/utils/SecureFileUpload.php';

try {
    // Check for bilingual fields
    $hasBilingual = isset($_POST['title_sr']) && isset($_POST['title_en']) &&
                    isset($_POST['content_sr']) && isset($_POST['content_en']);

    // Check for old format fields
    $hasOldFormat = isset($_POST['title']) && isset($_POST['content']);

    if (!$hasBilingual && !$hasOldFormat) {
        throw new Exception('Missing required fields');
    }

    if (!isset($_POST['category']) || !isset($_POST['author'])) {
        throw new Exception('Missing category or author');
    }

    $uploadDir = '../../uploads/blog-images/';
    $imageFileName = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploader = new SecureFileUpload($uploadDir, ['image'], 5242880);
        $imageFileName = $uploader->upload($_FILES['image']);
        if ($imageFileName === false) {
            throw new Exception('Image upload failed: ' . $uploader->getLastError());
        }
    }
    $imagePath = $imageFileName ? '/uploads/blog-images/' . $imageFileName : null;

    $featured = (!empty($_POST['featured']) && $_POST['featured'] !== '0') ? 1 : 0;

    // Update existing post
    if (isset($_POST['id']) && is_numeric($_POST['id'])) {
        $id = intval($_POST['id']);

        // Compute bilingual fields with auto-translation for UPDATE
        if ($hasBilingual) {
            $titleSr = $_POST['title_sr'];
            $contentSr = $_POST['content_sr'];

            if (!empty($_POST['title_en'])) {
                $titleEn = $_POST['title_en'];
            } else {
                $titleEn = Translator::translate($titleSr, 'sr', 'en');
                if ($titleEn === false) $titleEn = $titleSr;
            }

            if (!empty($_POST['content_en'])) {
                $contentEn = $_POST['content_en'];
            } else {
                $contentEn = Translator::translate($contentSr, 'sr', 'en');
                if ($contentEn === false) $contentEn = $contentSr;
            }
        }

        if ($imagePath) {
            if ($hasBilingual) {
                $query = "UPDATE posts SET title=?, title_sr=?, title_en=?, content=?, content_sr=?, content_en=?, image=?, category=?, featured=?, author=? WHERE id=?";
                $stmt = $conn->prepare($query);
                $stmt->bind_param('ssssssssisi', $titleSr, $titleSr, $titleEn, $contentSr, $contentSr, $contentEn,
                                  $imagePath, $_POST['category'], $featured, $_POST['author'], $id);
            } else {
                $query = "UPDATE posts SET title=?, content=?, image=?, category=?, featured=?, author=? WHERE id=?";
                $stmt = $conn->prepare($query);
                $stmt->bind_param('ssssisi', $_POST['title'], $_POST['content'], $imagePath, $_POST['category'], $featured, $_POST['author'], $id);
            }
        } else {
            if ($hasBilingual) {
                $query = "UPDATE posts SET title=?, title_sr=?, title_en=?, content=?, content_sr=?, content_en=?, category=?, featured=?, author=? WHERE id=?";
                $stmt = $conn->prepare($query);
                $stmt->bind_param('sssssssisi', $titleSr, $titleSr, $titleEn, $contentSr, $contentSr, $contentEn,
                                  $_POST['category'], $featured, $_POST['author'], $id);
            } else {
                $query = "UPDATE posts SET title=?, content=?, category=?, featured=?, author=? WHERE id=?";
                $stmt = $conn->prepare($query);
                $stmt->bind_param('sssisi', $_POST['title'], $_POST['content'], $_POST['category'], $featured, $_POST['author'], $id);
            }
        }
        if($stmt->execute()) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Post updated successfully',
                'post_id' => $id
            ]);
        } else {
            throw new Exception('Failed to update post');
        }
        exit;
    }

    // Add new post
    if ($hasBilingual) {
        $titleSr = $_POST['title_sr'];
        $contentSr = $_POST['content_sr'];

        if (!empty($_POST['title_en'])) {
            $titleEn = $_POST['title_en'];
        } else {
            $titleEn = Translator::translate($titleSr, 'sr', 'en');
            if ($titleEn === false) $titleEn = $titleSr;
        }

        if (!empty($_POST['content_en'])) {
            $contentEn = $_POST['content_en'];
        } else {
            $contentEn = Translator::translate($contentSr, 'sr', 'en');
            if ($contentEn === false) $contentEn = $contentSr;
        }

        $query = "INSERT INTO posts (title, title_sr, title_en, content, content_sr, content_en, image, category, featured, author)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ssssssssis', $titleSr, $titleSr, $titleEn, $contentSr, $contentSr, $contentEn,
                          $imagePath, $_POST['category'], $featured, $_POST['author']);
    } else {
        $query = "INSERT INTO posts (title, title_sr, title_en, content, content_sr, content_en, image, category, featured, author)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ssssssssis', $_POST['title'], $_POST['title'], $_POST['title'],
                          $_POST['content'], $_POST['content'], $_POST['content'],
                          $imagePath, $_POST['category'], $featured, $_POST['author']);
    }

    if($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Post added successfully',
            'post_id' => $conn->insert_id
        ]);
    } else {
        throw new Exception('Failed to add post');
    }

} catch(Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
