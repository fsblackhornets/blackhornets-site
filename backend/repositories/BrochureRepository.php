<?php

class BrochureRepository {
    public function __construct(private mysqli $conn) {}

    public function findByLang(string $lang): ?array {
        $key = 'brochure_pdf_' . $lang;
        $stmt = $this->conn->prepare("SELECT setting_value, updated_at FROM site_settings WHERE setting_key = ?");
        $stmt->bind_param('s', $key);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();

        if (!$row && $lang === 'sr') {
            $stmt2 = $this->conn->prepare("SELECT setting_value, updated_at FROM site_settings WHERE setting_key = 'brochure_pdf'");
            $stmt2->execute();
            $row = $stmt2->get_result()->fetch_assoc();
        }
        return $row ?: null;
    }
}
