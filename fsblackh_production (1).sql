-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 22, 2026 at 11:31 AM
-- Server version: 10.11.15-MariaDB-log
-- PHP Version: 8.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fsblackh_production`
--

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied') DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery_images`
--

CREATE TABLE `gallery_images` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `category` varchar(50) DEFAULT 'team',
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `member_roles`
--

CREATE TABLE `member_roles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` varchar(50) NOT NULL,
  `team` varchar(50) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `position_en` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `member_roles`
--

INSERT INTO `member_roles` (`id`, `user_id`, `role`, `team`, `department`, `position`, `position_en`, `created_at`) VALUES
(13, 5, 'team_member', 'mechanical', 'suspension_steering', 'Member', NULL, '2026-03-22 12:18:07'),
(14, 6, 'team_member', 'mechanical', 'suspension_steering', 'Member', NULL, '2026-03-22 12:18:07'),
(15, 7, 'team_member', 'mechanical', 'chassis_aero', 'Member', NULL, '2026-03-22 12:18:07'),
(16, 8, 'team_member', 'mechanical', 'chassis_aero', 'Member', NULL, '2026-03-22 12:18:07'),
(17, 9, 'sub_leader', 'mechanical', 'transmission_braking', 'Sub Leader', NULL, '2026-03-22 12:18:07'),
(18, 10, 'team_member', 'mechanical', 'transmission_braking', 'Member', NULL, '2026-03-22 12:18:07'),
(19, 11, 'team_member', 'mechanical', 'transmission_braking', 'Member', NULL, '2026-03-22 12:18:07'),
(20, 12, 'team_member', 'mechanical', 'transmission_braking', 'Member', NULL, '2026-03-22 12:18:07'),
(21, 13, 'sub_leader', 'electrical', 'low_voltage', 'Sub Leader', NULL, '2026-03-22 12:18:07'),
(22, 14, 'team_member', 'electrical', 'low_voltage', 'Member', NULL, '2026-03-22 12:18:07'),
(23, 15, 'team_member', 'electrical', 'low_voltage', 'Member', NULL, '2026-03-22 12:18:07'),
(24, 16, 'team_member', 'electrical', 'low_voltage', 'Member', NULL, '2026-03-22 12:18:07'),
(25, 17, 'team_member', 'electrical', 'low_voltage', 'Member', NULL, '2026-03-22 12:18:07'),
(26, 18, 'team_member', 'electrical', 'high_voltage', 'Member', NULL, '2026-03-22 12:18:07'),
(27, 19, 'team_member', 'electrical', 'high_voltage', 'Member', NULL, '2026-03-22 12:18:07'),
(28, 20, 'team_member', 'electrical', 'high_voltage', 'Member', NULL, '2026-03-22 12:18:07'),
(29, 21, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(30, 22, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(31, 23, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(32, 24, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(33, 25, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(34, 26, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(35, 27, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(36, 28, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(37, 29, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(38, 30, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(39, 31, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(40, 32, 'team_member', 'operating_business', 'marketing', 'Member', NULL, '2026-03-22 12:18:07'),
(41, 33, 'team_member', 'operating_business', 'management', 'Member', NULL, '2026-03-22 12:18:07'),
(42, 34, 'team_member', 'operating_business', 'management', 'Member', NULL, '2026-03-22 12:18:07'),
(43, 35, 'team_member', 'operating_business', 'management', 'Member', NULL, '2026-03-22 12:18:07'),
(44, 36, 'team_member', 'operating_business', 'sponsorships', 'Member', NULL, '2026-03-22 12:18:07'),
(45, 37, 'team_member', 'operating_business', 'sponsorships', 'Member', NULL, '2026-03-22 12:18:07'),
(46, 38, 'team_member', 'operating_business', 'sponsorships', 'Member', NULL, '2026-03-22 12:18:07');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `title_sr` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `content_sr` text DEFAULT NULL,
  `content_en` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `featured` tinyint(1) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `status` enum('published','draft') DEFAULT 'published'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post_comments`
--

CREATE TABLE `post_comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('approved','pending','spam') DEFAULT 'pending',
  `parent_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `due_date` date DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sponsors`
--

CREATE TABLE `sponsors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `tier` varchar(50) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `tier_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `position_en` varchar(255) DEFAULT NULL,
  `study_field` varchar(100) DEFAULT NULL,
  `faculty` varchar(100) DEFAULT '',
  `department` varchar(50) DEFAULT NULL,
  `team` varchar(50) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `projects` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_reports`
--

CREATE TABLE `team_reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `team` varchar(50) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('admin','team_member','sub_leader','team_leader','project_leader') DEFAULT 'team_member',
  `team` varchar(50) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `full_name`, `role`, `team`, `department`, `phone`, `status`, `created_at`) VALUES
(1, 'markazvaka23', '$2y$10$5oNUsUDW5mfqMMqBa.XZAOONvE8wIrC6H8oCEEn4PQHStQBIwqm2G', 'admin@blackhornets.local', 'Admin', 'admin', NULL, NULL, NULL, 'active', '2026-03-19 13:38:05'),
(5, 'angelina006sd', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'angelina006sd@gmail.com', 'Angelina Vučković', 'team_member', 'mechanical', 'suspension_steering', NULL, 'active', '2026-03-22 12:17:18'),
(6, 'danilo.ciric', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'danilo.g.ćirić39@gmail.com', 'Danilo Ćirić', 'team_member', 'mechanical', 'suspension_steering', NULL, 'active', '2026-03-22 12:17:18'),
(7, 'tothszilard000', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tothszilard000@gmail.com', 'Silard Tot', 'team_member', 'mechanical', 'chassis_aero', NULL, 'active', '2026-03-22 12:17:18'),
(8, 'brunozivkovic2006', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'brunozivkovic2006@gmail.com', 'Bruno Živković', 'team_member', 'mechanical', 'chassis_aero', NULL, 'active', '2026-03-22 12:17:18'),
(9, 'lazic.darko55', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'lazic.darko55@gmail.com', 'Darko Lazić', 'sub_leader', 'mechanical', 'transmission_braking', NULL, 'active', '2026-03-22 12:17:18'),
(10, 'stevanovicrade326', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'stevanovicrade326@gmail.com', 'Rade Stevanović', 'team_member', 'mechanical', 'transmission_braking', NULL, 'active', '2026-03-22 12:17:18'),
(11, 'dimandulajevic', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'dimandulajevic@gmail.com', 'Dimitrije Andulajević', 'team_member', 'mechanical', 'transmission_braking', NULL, 'active', '2026-03-22 12:17:18'),
(12, 'mitarlazarevic', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mitarlazarević8@gmail.com', 'Mitar Lazarević', 'team_member', 'mechanical', 'transmission_braking', NULL, 'active', '2026-03-22 12:17:18'),
(13, 'ivanberenic04', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ivanberenic04@gmail.com', 'Ivan Berenić', 'sub_leader', 'electrical', 'low_voltage', NULL, 'active', '2026-03-22 12:17:18'),
(14, 'milicabozovic42', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'milicabozovic42@gmail.com', 'Milica Božović', 'team_member', 'electrical', 'low_voltage', NULL, 'active', '2026-03-22 12:17:18'),
(15, 'npopovic325', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'npopovic325@gmail.com', 'Nikola Popović', 'team_member', 'electrical', 'low_voltage', NULL, 'active', '2026-03-22 12:17:18'),
(16, 'aleksavulin77', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'aleksavulin77@gmail.com', 'Aleksa Vulin', 'team_member', 'electrical', 'low_voltage', NULL, 'active', '2026-03-22 12:17:18'),
(17, 'marceticcontact', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'marceticcontact@gmail.com', 'Nemanja Marčetić', 'team_member', 'electrical', 'low_voltage', NULL, 'active', '2026-03-22 12:17:18'),
(18, 'andrejlucic16', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'andrejlucic16@gmail.com', 'Andrej Lučić', 'team_member', 'electrical', 'high_voltage', NULL, 'active', '2026-03-22 12:17:18'),
(19, 'markomales99', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'marko.males99@gmail.com', 'Marko Malešević', 'team_member', 'electrical', 'high_voltage', NULL, 'active', '2026-03-22 12:17:18'),
(20, 'aki.mijatovic', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'aki.mijatovic@gmail.com', 'Aleksa Mijatović', 'team_member', 'electrical', 'high_voltage', NULL, 'active', '2026-03-22 12:17:18'),
(21, 'dusansavic484', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'dusansavic484@gmail.com', 'Dušan Savić', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(22, 'visnicstefan1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'visnicstefan1@gmail.com', 'Stefan Višnić', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(23, 'marijacodo1207', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'marijacodo1207@gmail.com', 'Marija Ćodo', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(24, 'tamara.grujic06', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tamara.grujic06@gmail.com', 'Tamara Grujić', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(25, 'nikodinwork', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'nikodinwork@gmail.com', 'Nikodin Gregorin', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(26, 'milicajelicic06', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'milicajelicic06@gmail.com', 'Milica Jeličić', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(27, 'martarat05', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'martarat05@gmail.com', 'Marta Ratković', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(28, 'svetlana.blazenovic', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'svetlana.blazenovic@gmail.com', 'Svetlana Blaženović', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(29, 'stefanovic.dusan2001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'stefanovic.dusan2001@gmail.com', 'Dušan Stefanović', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(30, 'crnkovicnikola05', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'crnkovicnikola05@gmail.com', 'Nikola Crnković', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(31, 'ilicilija006', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ilicilija006@gmail.com', 'Ilija Ilić', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(32, 'mderdicc', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mderdicc@gmail.com', 'Marko Derdić', 'team_member', 'operating_business', 'marketing', NULL, 'active', '2026-03-22 12:17:18'),
(33, 'jacimovicsandra', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jacimovicsandra.school@gmail.com', 'Sandra Jaćimović', 'team_member', 'operating_business', 'management', NULL, 'active', '2026-03-22 12:17:18'),
(34, 'andreakolarski05', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'andreakolarski05@gmail.com', 'Andrea Kolarski', 'team_member', 'operating_business', 'management', NULL, 'active', '2026-03-22 12:17:18'),
(35, 'ternotara', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ternotara@gmail.com', 'Tara Terno', 'team_member', 'operating_business', 'management', NULL, 'active', '2026-03-22 12:17:18'),
(36, 'jelisavetadukic', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jelisavetadukic@gmail.com', 'Jelisaveta Dukić', 'team_member', 'operating_business', 'sponsorships', NULL, 'active', '2026-03-22 12:17:18'),
(37, 'tara.sijan4', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tara.sijan4@gmail.com', 'Tara Šijan', 'team_member', 'operating_business', 'sponsorships', NULL, 'active', '2026-03-22 12:17:18'),
(38, 'selenaminag', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'selenaminag@gmail.com', 'Mina Grković', 'team_member', 'operating_business', 'sponsorships', NULL, 'active', '2026-03-22 12:17:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `member_roles`
--
ALTER TABLE `member_roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_member_roles_user` (`user_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `sponsors`
--
ALTER TABLE `sponsors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `team_reports`
--
ALTER TABLE `team_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `member_roles`
--
ALTER TABLE `member_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `post_comments`
--
ALTER TABLE `post_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sponsors`
--
ALTER TABLE `sponsors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `team_reports`
--
ALTER TABLE `team_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD CONSTRAINT `gallery_images_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `post_comments`
--
ALTER TABLE `post_comments`
  ADD CONSTRAINT `post_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_comments_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `post_comments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `team_reports`
--
ALTER TABLE `team_reports`
  ADD CONSTRAINT `team_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
