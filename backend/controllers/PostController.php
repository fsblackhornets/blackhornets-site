<?php

class PostController {
    private PostService $service;

    public function __construct(mysqli $conn) {
        $this->service = new PostService(new PostRepository($conn));
    }

    public function index(array $params = []): void {
        Response::json(['status' => 'success', 'data' => $this->service->getAll()]);
    }

    public function show(array $params): void {
        $post = $this->service->getById((int)$params['id']);
        if (!$post) Response::error('Post not found', 404);
        Response::json(['status' => 'success', 'data' => $post]);
    }

    public function categories(array $params = []): void {
        Response::json(['status' => 'success', 'data' => $this->service->getCategories()]);
    }

    public function create(array $params = []): void {
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        if (empty($data['title_sr']) || empty($data['content_sr'])) {
            Response::error('title_sr and content_sr are required');
        }
        $author = $_SESSION['full_name'] ?? 'Admin';
        $id = $this->service->create($data, $author);
        Response::json(['status' => 'success', 'id' => $id], 201);
    }
}
