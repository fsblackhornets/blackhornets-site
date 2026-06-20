CREATE TABLE IF NOT EXISTS content_requests (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    type         ENUM('member', 'post', 'project', 'sponsor') NOT NULL,
    data         JSON NOT NULL,
    submitted_by INT NOT NULL,
    submitter_name VARCHAR(255) NOT NULL DEFAULT '',
    status       ENUM('pending', 'approved', 'declined') NOT NULL DEFAULT 'pending',
    admin_notes  TEXT,
    reviewed_by  INT DEFAULT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at  TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_status        (status),
    INDEX idx_submitted_by  (submitted_by),
    INDEX idx_type          (type)
);
