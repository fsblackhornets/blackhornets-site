<?php

class BrochureService {
    public function __construct(private BrochureRepository $repo) {}

    public function get(string $lang): ?array {
        $row = $this->repo->findByLang($lang);
        if (!$row) return null;
        return ['pdf_url' => 'panel/admin/' . $row['setting_value'], 'updated_at' => $row['updated_at']];
    }

    public function repo(): BrochureRepository { return $this->repo; }
}
