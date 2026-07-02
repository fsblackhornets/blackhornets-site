-- ================================================================
-- Black Hornets Racing — Database Setup
-- Updated: 2026-06-30
-- Compatible with: MySQL 5.7+ / MariaDB 10.4+
-- ================================================================
--
-- Import:
--   mysql -u root blackhornets < database.sql
--
-- Default admin credentials:
--   Username: admin
--   Password: BlackHornets2025!
--
-- Change the password immediately after first login.
-- ================================================================

SET NAMES utf8mb4;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Drop tables (children first)
-- --------------------------------------------------------

DROP TABLE IF EXISTS `content_requests`;
DROP TABLE IF EXISTS `gallery_images`;
DROP TABLE IF EXISTS `team_members`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `sponsors`;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `users`;

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('admin','manager') DEFAULT 'manager',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Default admin user (password: BlackHornets2025!)
INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `role`, `status`) VALUES
(1, 'admin', '$2b$10$TMl2pw3XsiYe6YkwJ.gquOAp8HtK0fbZX5/8hZJbUiaSYXyyEBbZ6', 'admin@blackhornets.local', 'Administrator', 'admin', 'active');

-- --------------------------------------------------------
-- Table: team_members  (roster people — no login credentials)
-- --------------------------------------------------------

CREATE TABLE `team_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('team_leader','project_leader','sub_leader','team_member') DEFAULT 'team_member',
  `status` enum('active','inactive') DEFAULT 'active',
  `position` varchar(100) DEFAULT NULL,
  `position_en` varchar(255) DEFAULT NULL,
  `academic_year` varchar(20) DEFAULT NULL,
  `study_field` varchar(100) DEFAULT NULL,
  `faculty` varchar(100) DEFAULT '',
  `department` varchar(50) DEFAULT NULL,
  `team` varchar(50) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `image_position` varchar(50) DEFAULT '50% 50%',
  `motivation` text DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `projects` text DEFAULT NULL,
  `achievements` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: posts
-- --------------------------------------------------------

CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `title_sr` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `content_sr` text DEFAULT NULL,
  `content_en` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image_position` varchar(50) DEFAULT '50% 50%',
  `category` varchar(100) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `status` enum('published','draft') DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: projects
-- --------------------------------------------------------

CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `due_date` date DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `image_position` varchar(50) DEFAULT '50% 50%',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: gallery_images
-- --------------------------------------------------------

CREATE TABLE `gallery_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `category` varchar(50) DEFAULT 'team',
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `gallery_images_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: sponsors
-- --------------------------------------------------------

CREATE TABLE `sponsors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `tier` varchar(50) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `image_position` varchar(50) DEFAULT '50% 50%',
  `tier_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: applications
-- --------------------------------------------------------

CREATE TABLE `applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `faculty` varchar(100) NOT NULL DEFAULT '',
  `major` varchar(50) NOT NULL,
  `academic_year` int(11) NOT NULL,
  `gpa` decimal(4,2) NOT NULL,
  `desired_position` varchar(50) NOT NULL,
  `experience` text DEFAULT NULL,
  `motivation` text NOT NULL,
  `resume_path` varchar(255) NOT NULL,
  `status` enum('pending','reviewing','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: contact_messages
-- --------------------------------------------------------

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied') DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: content_requests
-- --------------------------------------------------------

CREATE TABLE `content_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('member','post','project','sponsor','gallery') NOT NULL,
  `data` json NOT NULL,
  `submitted_by` int(11) NOT NULL,
  `submitter_name` varchar(255) NOT NULL DEFAULT '',
  `status` enum('pending','approved','declined') NOT NULL DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `reviewed_by` int(11) DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `submitted_by` (`submitted_by`),
  CONSTRAINT `content_requests_ibfk_1` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Table: site_settings
-- --------------------------------------------------------

CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ================================================================
-- Setup complete. 10 tables created, 1 admin user seeded.
-- content_requests.type includes: member, post, project, sponsor, gallery
-- ================================================================
