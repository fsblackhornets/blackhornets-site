-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: blackhornets
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,'Dusan','Stefanovic','stefanovic.dusan2001@gmail.com','0659446906','E342134','','Electrical Engineering',3,6.00,'Team Leader','sadesdd','jer miw se moza','69b3ee3383bed_21fa3d7b4e5eac3e.pdf','pending','2026-03-13 11:00:03','2026-03-13 11:00:03'),(2,'Dusan sasd','Stefanovic sad','stefanovic.dusan2001@gmail.com','0659446906','E342134','','Business Administration',3,6.00,'ss','','as','69b3ee9350b56_e9d25999893c4481.pdf','pending','2026-03-13 11:01:39','2026-03-13 11:01:39'),(3,'Dusan','Stefanovic','stefanovic.dusan2001@gmail.com','0659446906','E342134','','Electrical Engineering',2,7.00,'ss','fwwr','qwed','69b3ef6a9dee4_9a09ea7564955c8a.pdf','rejected','2026-03-13 11:05:14','2026-03-16 16:00:43'),(4,'Dusan','Stefanovic','stefanovic.dusan2001@gmail.com','9076151984','E342134','','Computer Science',3,6.02,'Team Leader','asd','sad','69b3f67a6dc9d_a79de3590abfc20e.pdf','accepted','2026-03-13 11:35:22','2026-03-16 15:05:17');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,'Test','test@test.com','Test','Test message','new','2026-03-12 11:50:25','2026-03-12 11:50:25'),(2,'Test','test@test.com','Test','Test message','new','2026-03-12 11:50:25','2026-03-12 11:50:25');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_images`
--

DROP TABLE IF EXISTS `gallery_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery_images`
--

LOCK TABLES `gallery_images` WRITE;
/*!40000 ALTER TABLE `gallery_images` DISABLE KEYS */;
INSERT INTO `gallery_images` VALUES (1,'ovo je proba izmene','ovo je opis slike',NULL,'uploads/gallery/69b2a701c96b2_f39b6a0c1878ecbe.png','events','sddddd',1,1,NULL,'2026-03-12 11:44:01'),(2,'slika 2','ovo je opcioni opis slike',NULL,'uploads/gallery/69b2b4c2498ae_22e38de2a0f89cec.png','team','sddddd',1,1,NULL,'2026-03-12 12:42:42'),(3,'dasda','',NULL,'uploads/gallery/69b5927291ce6_5d31a258d8f4e4e2.png','race_cars','asd',3,1,NULL,'2026-03-14 16:53:06'),(4,'asd','',NULL,'uploads/gallery/69b59296280a6_1e6cdcacb9557568.png','race_cars','asd',0,1,NULL,'2026-03-14 16:53:42'),(5,'affff','',NULL,'uploads/gallery/69b592a651a9e_8e5183ab19480657.png','race_cars','asd',1,1,NULL,'2026-03-14 16:53:58'),(6,'slika prevod','ovo je opis slike koji se prevodi sa srpskog na engleski','this is a description of the image that is translated from Serbian to English','uploads/gallery/69b80e92b46ab_c707e67f74c2fae8.jpg','race_cars','ovo je alternativni tekst koji se ne prevodi',0,1,NULL,'2026-03-16 14:07:14');
/*!40000 ALTER TABLE `gallery_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_roles`
--

DROP TABLE IF EXISTS `member_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `role` varchar(50) NOT NULL,
  `team` varchar(50) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `position_en` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_member_roles_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_roles`
--

LOCK TABLES `member_roles` WRITE;
/*!40000 ALTER TABLE `member_roles` DISABLE KEYS */;
INSERT INTO `member_roles` VALUES (1,2,'team_member','mechanical','rolling_stock',NULL,NULL,'2026-03-17 16:00:49'),(2,3,'team_leader',NULL,NULL,NULL,NULL,'2026-03-17 16:00:49'),(3,4,'team_member','electrical','motor_inverter',NULL,NULL,'2026-03-17 16:00:49'),(60,55,'team_leader',NULL,NULL,NULL,NULL,'2026-03-18 11:24:55'),(61,55,'project_leader','operating_business',NULL,NULL,NULL,'2026-03-18 11:24:55'),(62,55,'sub_leader','operating_business','management','project_coordinator',NULL,'2026-03-18 11:24:55'),(63,55,'sub_leader','operating_business','sponsorships','sponsorship_manager',NULL,'2026-03-18 11:24:55'),(64,56,'project_leader','mechanical',NULL,NULL,NULL,'2026-03-18 11:24:55'),(65,57,'project_leader','electrical',NULL,NULL,NULL,'2026-03-18 11:24:55'),(66,58,'sub_leader','mechanical','carbody','designer',NULL,'2026-03-18 11:24:55'),(67,59,'sub_leader','mechanical','rolling_stock','suspension_engineer',NULL,'2026-03-18 11:24:55'),(68,60,'sub_leader','electrical','drive_and_cooling','electronics_engineer',NULL,'2026-03-18 11:24:55'),(69,61,'sub_leader','electrical','motor_inverter','electronics_engineer',NULL,'2026-03-18 11:24:55'),(70,62,'sub_leader','electrical','bms_can_battery','battery_specialist',NULL,'2026-03-18 11:24:55'),(71,63,'sub_leader','operating_business','marketing','marketing_manager',NULL,'2026-03-18 11:24:55'),(72,64,'team_member','mechanical','carbody','designer',NULL,'2026-03-18 11:24:55'),(73,65,'team_member','mechanical','carbody','cad_engineer',NULL,'2026-03-18 11:24:55'),(74,66,'team_member','mechanical','rolling_stock','suspension_engineer',NULL,'2026-03-18 11:24:55'),(75,67,'team_member','mechanical','rolling_stock','chassis_engineer',NULL,'2026-03-18 11:24:55'),(76,68,'team_member','electrical','drive_and_cooling','thermal_engineer',NULL,'2026-03-18 11:24:55'),(77,69,'team_member','electrical','drive_and_cooling','electronics_engineer',NULL,'2026-03-18 11:24:55'),(78,70,'team_member','electrical','motor_inverter','electronics_engineer',NULL,'2026-03-18 11:24:55'),(79,71,'team_member','electrical','motor_inverter','pcb_designer',NULL,'2026-03-18 11:24:55'),(80,72,'team_member','electrical','bms_can_battery','firmware_developer',NULL,'2026-03-18 11:24:55'),(81,73,'team_member','electrical','bms_can_battery','software_developer',NULL,'2026-03-18 11:24:55'),(82,74,'team_member','operating_business','marketing','content_creator',NULL,'2026-03-18 11:24:55'),(83,75,'team_member','operating_business','marketing','social_media_manager',NULL,'2026-03-18 11:24:55'),(84,76,'team_member','operating_business','sponsorships','sponsorship_manager',NULL,'2026-03-18 11:24:55'),(85,77,'team_member','operating_business','sponsorships','event_coordinator',NULL,'2026-03-18 11:24:55'),(86,78,'team_member','operating_business','management','project_coordinator',NULL,'2026-03-18 11:24:55'),(87,79,'team_member','operating_business','management','budget_analyst',NULL,'2026-03-18 11:24:55'),(88,80,'team_member','operating_business','marketing','Kontent kreator','Content creator','2026-03-18 11:49:59');
/*!40000 ALTER TABLE `member_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_comments`
--

DROP TABLE IF EXISTS `post_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `post_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('approved','pending','spam') DEFAULT 'pending',
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `post_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_comments_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `post_comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_comments`
--

LOCK TABLES `post_comments` WRITE;
/*!40000 ALTER TABLE `post_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `status` enum('published','draft') DEFAULT 'published',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (2,'proba 222','proba 222','proba 222','proba22','proba22','proba22','/uploads/blog-images/69b2ad7e70e83.png','Technology','0','2026-03-12 12:11:42','2026-03-12 13:00:47',1,0,'published'),(3,'Test Post','Test Post','Test Post EN','Test content','Test content','Test content EN',NULL,'Technology','Admin','2026-03-12 12:36:47','2026-03-14 18:03:58',0,0,'draft'),(4,'Test No Featured','Test No Featured','Test EN','Content','Content','Content EN',NULL,'Events','Admin','2026-03-12 12:36:52','2026-03-14 18:03:56',0,0,'draft'),(5,'Test Hidden','Test Hidden','Test EN','Content','Content','Content EN',NULL,'Technology','Admin','2026-03-12 12:38:07','2026-03-14 18:03:53',1,0,'draft'),(6,'sdasdad','sdasdad','sdasdad','ajde da pise nesto smisleno','ajde da pise nesto smisleno','ajde da pise nesto smisleno','/uploads/blog-images/69b2b42fa9e98.png','Competitions','asd','2026-03-12 12:40:15','2026-03-12 13:00:47',0,0,'published'),(7,'ovo je naslov stranice','ovo je naslov stranice','this is the page title','mrzi me da razmisljam tako da cu nalupati recenice koje mi samo idu iz glave. ovo koristim iskljucivo kao testni primer za prevodioca','mrzi me da razmisljam tako da cu nalupati recenice koje mi samo idu iz glave. ovo koristim iskljucivo kao testni primer za prevodioca','i hate to think so I\'m going to beat sentences that just go out of my head. I use this exclusively as a test example for a translator','/uploads/blog-images/69b59e60b03a5.png','Competitions','Samuel Benka','2026-03-14 17:44:02','2026-03-14 17:44:02',0,0,'published'),(8,'POslednja proba','POslednja proba','All right, I\'m going to give this one last shot.','Ovo je sadrzaj objave za koju se nadam da je poslednje testiranje koje treba da obavim pre pustanja sajta u etar','Ovo je sadrzaj objave za koju se nadam da je poslednje testiranje koje treba da obavim pre pustanja sajta u etar','This is the content of the post that I hope is the last test I need to do before releasing the site into the ether','/uploads/blog-images/69baa38ea36a9.jpg','Team Updates','Dušan Petrović','2026-03-18 13:07:28','2026-03-18 13:07:28',0,0,'published');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `due_date` date DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'brochure_pdf_sr','uploads/brochure/brochure_1773328164_69b2d7243e9f7.pdf','2026-03-14 16:35:23',1),(2,'brochure_pdf_en','uploads/brochure/brochure_en_1773506135_69b58e57a9e8e.pdf','2026-03-14 16:35:35',1);
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sponsors`
--

DROP TABLE IF EXISTS `sponsors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sponsors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `tier` varchar(50) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `tier_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sponsors`
--

LOCK TABLES `sponsors` WRITE;
/*!40000 ALTER TABLE `sponsors` DISABLE KEYS */;
INSERT INTO `sponsors` VALUES (1,'DUSAN STEFANOVIC','marko zbvaka',NULL,'F3 - Silver','https://www.google.com/','sponsor_1773399182_69b3ec8e88c5f.png',1,'2026-03-13 10:53:02'),(2,'Continental','\"Contint\" je oblik francuskog glagola contenir (sadržati), koji se koristi u trećem licu jednine prošlog vremena (passé simple), što znači \"sadržao je\" ili \"obuhvatio je\". Ponekad se pogrešno koristi kao sinonim za zadovoljstvo (content), ali je primarno glagolski oblik',NULL,'F1 - Platinum','https://ssluzba.ftn.uns.ac.rs/ssluzbasp/','sponsor_1773670643_69b810f348638.jpg',1,'2026-03-16 14:17:23'),(3,'prohtariajn','ovo je opis moje kompanije koja sponorise ovaj mladi tim','this is a description of my company that sponsors this young team','F1 - Platinum','https://github.com/fsblackhornets/fsproject','sponsor_1773670976_69b812405b334.jpg',2,'2026-03-16 14:22:56'),(4,'ftn','ovo je fakultet tehnickih nauka','this is a faculty of technical sciences','Institucija','','sponsor_1773835047_69ba93278744d.jpg',1,'2026-03-18 11:57:27');
/*!40000 ALTER TABLE `sponsors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
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
  `motivation` text DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
INSERT INTO `team_members` VALUES (1,2,'ss',NULL,'3','ftn','','rolling_stock','mechanical',23,NULL,NULL,NULL,NULL,'2026-03-12 11:42:23'),(2,3,'Team Leader',NULL,'2','ftn ff','',NULL,NULL,23,NULL,'69b3ed99e0b5f_91338a45a1d69d7c.png','hahahah strasno','ovo su moje vestine','2026-03-12 11:43:00'),(3,4,'proizvodjac',NULL,'0','Electrical Engineering','','motor_inverter','electrical',23,NULL,'69b5a7daddf1e_00e4df3914d20ee8.jpg','ovo je mojka motivacija','majke mi moje','2026-03-14 18:17:17'),(54,55,'project_coordinator',NULL,'4','Mechanical Engineering','Faculty of Technical Sciences','management','operating_business',23,'2003-05-15',NULL,NULL,NULL,'2026-03-18 11:24:55'),(55,56,'engineer',NULL,'3','Mechanical Engineering','Faculty of Technical Sciences',NULL,'mechanical',22,'2004-02-10',NULL,NULL,NULL,'2026-03-18 11:24:55'),(56,57,'electronics_engineer',NULL,'4','Electrical Engineering','Faculty of Technical Sciences',NULL,'electrical',23,'2003-08-22',NULL,NULL,NULL,'2026-03-18 11:24:55'),(57,58,'designer',NULL,'3','Mechanical Engineering','Faculty of Technical Sciences','carbody','mechanical',22,'2004-01-05',NULL,NULL,NULL,'2026-03-18 11:24:55'),(58,59,'suspension_engineer',NULL,'3','Mechanical Engineering','Faculty of Technical Sciences','rolling_stock','mechanical',21,'2005-03-18',NULL,NULL,NULL,'2026-03-18 11:24:55'),(59,60,'electronics_engineer',NULL,'2','Electrical Engineering','Faculty of Technical Sciences','drive_and_cooling','electrical',21,'2005-07-12',NULL,NULL,NULL,'2026-03-18 11:24:55'),(60,61,'electronics_engineer',NULL,'3','Electrical Engineering','Faculty of Technical Sciences','motor_inverter','electrical',22,'2004-11-30',NULL,NULL,NULL,'2026-03-18 11:24:55'),(61,62,'battery_specialist',NULL,'2','Electrical Engineering','Faculty of Technical Sciences','bms_can_battery','electrical',20,'2006-04-25',NULL,NULL,NULL,'2026-03-18 11:24:55'),(62,63,'marketing_manager',NULL,'2','Marketing','Faculty of Economics','marketing','operating_business',21,'2005-09-08',NULL,NULL,NULL,'2026-03-18 11:24:55'),(63,64,'designer',NULL,'2','Mechanical Engineering','Faculty of Technical Sciences','carbody','mechanical',20,'2006-06-14',NULL,NULL,NULL,'2026-03-18 11:24:55'),(64,65,'cad_engineer',NULL,'1','Mechanical Engineering','Faculty of Technical Sciences','carbody','mechanical',19,'2007-02-20',NULL,NULL,NULL,'2026-03-18 11:24:55'),(65,66,'suspension_engineer',NULL,'2','Mechanical Engineering','Faculty of Technical Sciences','rolling_stock','mechanical',20,'2006-10-01',NULL,NULL,NULL,'2026-03-18 11:24:55'),(66,67,'chassis_engineer',NULL,'3','Mechanical Engineering','Faculty of Technical Sciences','rolling_stock','mechanical',21,'2005-12-07',NULL,NULL,NULL,'2026-03-18 11:24:55'),(67,68,'thermal_engineer',NULL,'2','Electrical Engineering','Faculty of Technical Sciences','drive_and_cooling','electrical',20,'2006-05-30',NULL,NULL,NULL,'2026-03-18 11:24:55'),(68,69,'electronics_engineer',NULL,'1','Electrical Engineering','Faculty of Technical Sciences','drive_and_cooling','electrical',19,'2007-08-15',NULL,NULL,NULL,'2026-03-18 11:24:55'),(69,70,'electronics_engineer',NULL,'3','Electrical Engineering','Faculty of Technical Sciences','motor_inverter','electrical',22,'2004-04-11',NULL,NULL,NULL,'2026-03-18 11:24:55'),(70,71,'pcb_designer',NULL,'2','Electrical Engineering','Faculty of Technical Sciences','motor_inverter','electrical',20,'2006-01-28',NULL,NULL,NULL,'2026-03-18 11:24:55'),(71,72,'firmware_developer',NULL,'3','Electrical Engineering','Faculty of Technical Sciences','bms_can_battery','electrical',22,'2004-07-19',NULL,NULL,NULL,'2026-03-18 11:24:55'),(72,73,'software_developer',NULL,'2','Electrical Engineering','Faculty of Technical Sciences','bms_can_battery','electrical',21,'2005-11-03',NULL,NULL,NULL,'2026-03-18 11:24:55'),(73,74,'content_creator',NULL,'1','Marketing','Faculty of Economics','marketing','operating_business',19,'2007-03-22',NULL,NULL,NULL,'2026-03-18 11:24:55'),(74,75,'social_media_manager',NULL,'2','Marketing','Faculty of Economics','marketing','operating_business',20,'2006-09-17',NULL,NULL,NULL,'2026-03-18 11:24:55'),(75,76,'sponsorship_manager',NULL,'3','Business Administration','Faculty of Economics','sponsorships','operating_business',22,'2004-06-08',NULL,NULL,NULL,'2026-03-18 11:24:55'),(76,77,'event_coordinator',NULL,'2','Business Administration','Faculty of Economics','sponsorships','operating_business',21,'2005-04-14',NULL,NULL,NULL,'2026-03-18 11:24:55'),(77,78,'project_coordinator',NULL,'2','Business Administration','Faculty of Economics','management','operating_business',20,'2006-08-25',NULL,NULL,NULL,'2026-03-18 11:24:55'),(78,79,'budget_analyst',NULL,'3','Business Administration','Faculty of Economics','management','operating_business',22,'2004-12-30',NULL,NULL,NULL,'2026-03-18 11:24:55'),(79,80,'Kontent kreator','Content creator','3','Computer Science','FTN','marketing','operating_business',0,NULL,NULL,NULL,NULL,'2026-03-18 11:49:59');
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_reports`
--

DROP TABLE IF EXISTS `team_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `team` varchar(50) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `team_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_reports`
--

LOCK TABLES `team_reports` WRITE;
/*!40000 ALTER TABLE `team_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('admin','team_member','sub_leader','team_leader','project_leader') DEFAULT 'team_member',
  `team` varchar(50) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'mika','$2y$10$pTtbJki39XuobGe.e6X75OtM.xOXw4KkLGM9AHZe0sSBF9p1oKUdy','mika@gmail.com','mika','team_member','mechanical','rolling_stock','+1','active','2026-03-12 11:42:23'),(3,'zika','$2y$10$pQhJAXMi5.zoN6icevnheeRNYgaExZSU5nYSRHTjbwCbpmzmAAAha','zika@uns.ac.rs','Marko Zikic','team_leader',NULL,NULL,'+2','active','2026-03-12 11:43:00'),(4,'tester','$2y$10$mcvYkPB5NG9ECa.1Gi8w5erkefm2UonCeHa5xyRBKufpnku4Q2.Cq','sreckomarinkovic000@gmail.com','Srecko Marinkovic','team_member','electrical','motor_inverter','0659446906','active','2026-03-14 18:17:17'),(55,'dusan_petrovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','dusan@blackhornets.local','Dušan Petrović','team_leader','operating_business','management','+381601234567','active','2026-03-18 11:24:55'),(56,'marko_jovanovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','marko@blackhornets.local','Marko Jovanović','project_leader','mechanical',NULL,'+381601234568','active','2026-03-18 11:24:55'),(57,'nikola_stefanovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','nikola@blackhornets.local','Nikola Stefanović','project_leader','electrical',NULL,'+381601234569','active','2026-03-18 11:24:55'),(58,'ana_nikolic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','ana@blackhornets.local','Ana Nikolić','sub_leader','mechanical','carbody','+381601234570','active','2026-03-18 11:24:55'),(59,'stefan_djordjevic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','stefan@blackhornets.local','Stefan Đorđević','sub_leader','mechanical','rolling_stock','+381601234571','active','2026-03-18 11:24:55'),(60,'jelena_popovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','jelena@blackhornets.local','Jelena Popović','sub_leader','electrical','drive_and_cooling','+381601234572','active','2026-03-18 11:24:55'),(61,'milan_ilic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','milan@blackhornets.local','Milan Ilić','sub_leader','electrical','motor_inverter','+381601234573','active','2026-03-18 11:24:55'),(62,'ivana_markovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','ivana@blackhornets.local','Ivana Marković','sub_leader','electrical','bms_can_battery','+381601234574','active','2026-03-18 11:24:55'),(63,'sara_todorovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','sara@blackhornets.local','Sara Todorović','sub_leader','operating_business','marketing','+381601234575','active','2026-03-18 11:24:55'),(64,'luka_mitrovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','luka@blackhornets.local','Luka Mitrović','team_member','mechanical','carbody','+381601234576','active','2026-03-18 11:24:55'),(65,'maja_pavlovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','maja@blackhornets.local','Maja Pavlović','team_member','mechanical','carbody','+381601234577','active','2026-03-18 11:24:55'),(66,'petar_lazarevic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','petar@blackhornets.local','Petar Lazarević','team_member','mechanical','rolling_stock','+381601234578','active','2026-03-18 11:24:55'),(67,'milica_cvetic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','milica@blackhornets.local','Milica Cvetić','team_member','mechanical','rolling_stock','+381601234579','active','2026-03-18 11:24:55'),(68,'vuk_radosavljevic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','vuk@blackhornets.local','Vuk Radosavljević','team_member','electrical','drive_and_cooling','+381601234580','active','2026-03-18 11:24:55'),(69,'tamara_savic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','tamara@blackhornets.local','Tamara Savić','team_member','electrical','drive_and_cooling','+381601234581','active','2026-03-18 11:24:55'),(70,'aleksa_antic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','aleksa@blackhornets.local','Aleksa Antić','team_member','electrical','motor_inverter','+381601234582','active','2026-03-18 11:24:55'),(71,'nina_vukovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','nina@blackhornets.local','Nina Vuković','team_member','electrical','motor_inverter','+381601234583','active','2026-03-18 11:24:55'),(72,'filip_milovanovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','filip@blackhornets.local','Filip Milovanović','team_member','electrical','bms_can_battery','+381601234584','active','2026-03-18 11:24:55'),(73,'katarina_jokic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','katarina@blackhornets.local','Katarina Jokić','team_member','electrical','bms_can_battery','+381601234585','active','2026-03-18 11:24:55'),(74,'teodora_ristic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','teodora@blackhornets.local','Teodora Ristić','team_member','operating_business','marketing','+381601234586','active','2026-03-18 11:24:55'),(75,'ognjen_zdravkovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','ognjen@blackhornets.local','Ognjen Zdravković','team_member','operating_business','marketing','+381601234587','active','2026-03-18 11:24:55'),(76,'nemanja_obradovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','nemanja@blackhornets.local','Nemanja Obradović','team_member','operating_business','sponsorships','+381601234588','active','2026-03-18 11:24:55'),(77,'jovana_kostic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','jovana@blackhornets.local','Jovana Kostić','team_member','operating_business','sponsorships','+381601234589','active','2026-03-18 11:24:55'),(78,'david_stankovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','david@blackhornets.local','David Stanković','team_member','operating_business','management','+381601234590','active','2026-03-18 11:24:55'),(79,'isidora_petrovic','$2y$10$H0pUOhPwCjlQzcrQjWuv3eiXjU1MwpdTkaE6kKCurbvSM6I5Cyslu','isidora@blackhornets.local','Isidora Petrović','team_member','operating_business','management','+381601234591','active','2026-03-18 11:24:55'),(80,'dusan_stefanovic','$2y$10$9XwdJHDLMLSdXhND6n0BKugmNflnytRM7R6Rb8YPLPckGNdOTtkrW','stefanovic.dusan2001@gmail.com','Dusan Stefanovic','team_member','operating_business','marketing','9076151984','active','2026-03-18 11:49:59'),(81,'markazvaka23','$2y$10$5oNUsUDW5mfqMMqBa.XZAOONvE8wIrC6H8oCEEn4PQHStQBIwqm2G','admin@blackhornets.local','Admin','admin',NULL,NULL,NULL,'active','2026-03-18 12:34:38');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'blackhornets'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-18 15:07:33
