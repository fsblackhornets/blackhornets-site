<?php

class BrochureController {
    private BrochureService $service;

    public function __construct(mysqli $conn) {
        $this->service = new BrochureService(new BrochureRepository($conn));
    }

    public function show(array $params = []): void {
        $lang = ($_GET['lang'] ?? 'sr') === 'en' ? 'en' : 'sr';
        $data = $this->service->get($lang);
        Response::json($data
            ? ['success' => true, 'data' => $data]
            : ['success' => false, 'data' => null, 'message' => 'No brochure uploaded yet']
        );
    }
}
