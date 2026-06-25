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

    public function upsert(string $key, string $value, int $userId): void {
        $existing = $this->conn->prepare("SELECT id FROM site_settings WHERE setting_key = ?");
        $existing->bind_param('s', $key);
        $existing->execute();
        $row = $existing->get_result()->fetch_assoc();

        if ($row) {
            $stmt = $this->conn->prepare(
                "UPDATE site_settings SET setting_value = ?, updated_by = ?, updated_at = NOW() WHERE setting_key = ?"
            );
            $stmt->bind_param('sis', $value, $userId, $key);
        } else {
            $stmt = $this->conn->prepare(
                "INSERT INTO site_settings (setting_key, setting_value, updated_by, updated_at) VALUES (?, ?, ?, NOW())"
            );
            $stmt->bind_param('ssi', $key, $value, $userId);
        }
        $stmt->execute();
    }
}
