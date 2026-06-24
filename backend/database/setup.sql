-- ================================================================
-- Black Hornets Racing — Database Setup
-- Compatible with: MariaDB 10.4+ / MySQL 5.7+
--
-- Usage:
--   Option A (CLI):
--     mysql -u root -p blackhornets < backend/database/setup.sql
--
--   Option B (phpMyAdmin):
--     1. Create a database (e.g. blackhornets)
--     2. Import tab → choose this file → Go
--
-- After import:
--   Admin login: /panel/admin/login.php
--   Username:    admin
--   Password:    BlackHornets2025!   ← CHANGE THIS IMMEDIATELY
-- ================================================================

SET NAMES utf8mb4;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Drop existing tables (children before parents)
-- --------------------------------------------------------

DROP TABLE IF EXISTS `gallery_images`;
DROP TABLE IF EXISTS `team_members`;
DROP TABLE IF EXISTS `content_requests`;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `post_comments`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `sponsors`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `users`;

-- --------------------------------------------------------
-- users
-- --------------------------------------------------------

CREATE TABLE `users` (
  `id`              int(11)      NOT NULL AUTO_INCREMENT,
  `username`        varchar(100) NOT NULL,
  `password`        varchar(255) NOT NULL,
  `email`           varchar(100) NOT NULL,
  `full_name`       varchar(100) NOT NULL,
  `role`            enum('admin','team_member','sub_leader','team_leader','project_leader') DEFAULT 'team_member',
  `team`            varchar(50)  DEFAULT NULL,
  `department`      varchar(50)  DEFAULT NULL,
  `phone`           varchar(20)  DEFAULT NULL,
  `study_field`     varchar(100) DEFAULT NULL,
  `position`        varchar(100) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT 'default.jpg',
  `status`          enum('active','inactive') DEFAULT 'active',
  `created_at`      timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin (password: BlackHornets2025!)
INSERT INTO `users` (`username`, `password`, `email`, `full_name`, `role`, `status`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@blackhornets.local', 'Admin', 'admin', 'active');

-- --------------------------------------------------------
-- team_members
-- --------------------------------------------------------

CREATE TABLE `team_members` (
  `id`              int(11)      NOT NULL AUTO_INCREMENT,
  `user_id`         int(11)      NOT NULL,
  `position`        varchar(100) DEFAULT NULL,
  `position_en`     varchar(255) DEFAULT NULL,
  `academic_year`   varchar(20)  DEFAULT NULL,
  `study_field`     varchar(100) DEFAULT NULL,
  `faculty`         varchar(100) DEFAULT '',
  `department`      varchar(50)  DEFAULT NULL,
  `team`            varchar(50)  DEFAULT NULL,
  `age`             int(11)      DEFAULT NULL,
  `date_of_birth`   date         DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `motivation`      text         DEFAULT NULL,
  `skills`          text         DEFAULT NULL,
  `projects`        text         DEFAULT NULL,
  `achievements`    text         DEFAULT NULL,
  `created_at`      timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- posts
-- --------------------------------------------------------

CREATE TABLE `posts` (
  `id`         int(11)      NOT NULL AUTO_INCREMENT,
  `title`      varchar(255) DEFAULT NULL,
  `title_sr`   varchar(255) DEFAULT NULL,
  `title_en`   varchar(255) DEFAULT NULL,
  `content`    text         DEFAULT NULL,
  `content_sr` text         DEFAULT NULL,
  `content_en` text         DEFAULT NULL,
  `image`      varchar(255) DEFAULT NULL,
  `category`   varchar(100) DEFAULT NULL,
  `author`     varchar(100) DEFAULT NULL,
  `featured`   tinyint(1)   DEFAULT 0,
  `views`      int(11)      DEFAULT 0,
  `status`     enum('published','draft') DEFAULT 'published',
  `created_at` timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- projects
-- --------------------------------------------------------

CREATE TABLE `projects` (
  `id`          int(11)      NOT NULL AUTO_INCREMENT,
  `name`        varchar(255) NOT NULL,
  `description` text         DEFAULT NULL,
  `status`      varchar(50)  DEFAULT 'Active',
  `due_date`    date         DEFAULT NULL,
  `duration`    varchar(100) DEFAULT NULL,
  `progress`    int(11)      DEFAULT 0,
  `image`       varchar(255) DEFAULT NULL,
  `created_at`  timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- gallery_images
-- --------------------------------------------------------

CREATE TABLE `gallery_images` (
  `id`             int(11)      NOT NULL AUTO_INCREMENT,
  `title`          varchar(255) DEFAULT NULL,
  `description`    text         DEFAULT NULL,
  `description_en` text         DEFAULT NULL,
  `image_path`     varchar(255) NOT NULL,
  `category`       varchar(50)  DEFAULT 'team',
  `alt_text`       varchar(255) DEFAULT NULL,
  `sort_order`     int(11)      DEFAULT 0,
  `is_active`      tinyint(1)   DEFAULT 1,
  `created_by`     int(11)      DEFAULT NULL,
  `created_at`     timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `gallery_images_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- sponsors
-- --------------------------------------------------------

CREATE TABLE `sponsors` (
  `id`             int(11)      NOT NULL AUTO_INCREMENT,
  `name`           varchar(255) NOT NULL,
  `description`    text         DEFAULT NULL,
  `description_en` text         DEFAULT NULL,
  `tier`           varchar(50)  NOT NULL,
  `website`        varchar(255) DEFAULT NULL,
  `logo`           varchar(255) DEFAULT NULL,
  `tier_order`     int(11)      DEFAULT 0,
  `created_at`     timestamp    NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- applications
-- --------------------------------------------------------

CREATE TABLE `applications` (
  `id`               int(11)        NOT NULL AUTO_INCREMENT,
  `first_name`       varchar(50)    NOT NULL,
  `last_name`        varchar(50)    NOT NULL,
  `email`            varchar(100)   NOT NULL,
  `phone`            varchar(20)    NOT NULL,
  `student_id`       varchar(20)    NOT NULL,
  `faculty`          varchar(100)   NOT NULL DEFAULT '',
  `major`            varchar(50)    NOT NULL,
  `academic_year`    int(11)        NOT NULL,
  `gpa`              decimal(4,2)   NOT NULL,
  `desired_position` varchar(50)    NOT NULL,
  `experience`       text           DEFAULT NULL,
  `motivation`       text           NOT NULL,
  `resume_path`      varchar(255)   NOT NULL,
  `status`           enum('pending','reviewing','accepted','rejected') DEFAULT 'pending',
  `created_at`       timestamp      NOT NULL DEFAULT current_timestamp(),
  `updated_at`       timestamp      NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- contact_messages
-- --------------------------------------------------------

CREATE TABLE `contact_messages` (
  `id`         int(11)      NOT NULL AUTO_INCREMENT,
  `name`       varchar(100) NOT NULL,
  `email`      varchar(100) NOT NULL,
  `subject`    varchar(200) NOT NULL,
  `message`    text         NOT NULL,
  `status`     enum('new','read','replied') DEFAULT 'new',
  `created_at` timestamp    NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- content_requests (manager workflow)
-- --------------------------------------------------------

CREATE TABLE `content_requests` (
  `id`             int(11)      NOT NULL AUTO_INCREMENT,
  `type`           enum('member','post','project','sponsor') NOT NULL,
  `data`           json         NOT NULL,
  `submitted_by`   int(11)      NOT NULL,
  `submitter_name` varchar(255) NOT NULL DEFAULT '',
  `status`         enum('pending','approved','declined') NOT NULL DEFAULT 'pending',
  `admin_notes`    text         DEFAULT NULL,
  `reviewed_by`    int(11)      DEFAULT NULL,
  `created_at`     timestamp    NOT NULL DEFAULT current_timestamp(),
  `reviewed_at`    timestamp    NULL DEFAULT NULL,
  INDEX `idx_status`       (`status`),
  INDEX `idx_submitted_by` (`submitted_by`),
  INDEX `idx_type`         (`type`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- site_settings
-- --------------------------------------------------------

CREATE TABLE `site_settings` (
  `id`            int(11)      NOT NULL AUTO_INCREMENT,
  `setting_key`   varchar(100) NOT NULL,
  `setting_value` text         NOT NULL,
  `updated_at`    timestamp    NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by`    int(11)      DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ================================================================
-- Done. 9 tables created, 1 admin user seeded.
-- Change admin password immediately after first login.
-- ================================================================
