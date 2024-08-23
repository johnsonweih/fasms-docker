-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: fasms_dev
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `fasms_dev`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `fasms_dev` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `fasms_dev`;

--
-- Table structure for table `administrators`
--

DROP TABLE IF EXISTS `administrators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrators` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrators`
--

/*!40000 ALTER TABLE `administrators` DISABLE KEYS */;
INSERT INTO `administrators` (`id`, `username`, `password`, `email`, `created_at`) VALUES (1,'admin1','hashed_password','admin1@example.com','2024-08-22 05:24:50');
/*!40000 ALTER TABLE `administrators` ENABLE KEYS */;

--
-- Table structure for table `applicants`
--

DROP TABLE IF EXISTS `applicants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applicants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `employment_status` enum('employed','unemployed') NOT NULL,
  `sex` enum('male','female') NOT NULL,
  `date_of_birth` date NOT NULL,
  `marital_status` enum('single','married','widowed','divorced') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applicants`
--

/*!40000 ALTER TABLE `applicants` DISABLE KEYS */;
INSERT INTO `applicants` (`id`, `name`, `employment_status`, `sex`, `date_of_birth`, `marital_status`, `created_at`) VALUES (1,'James','unemployed','male','1990-07-01','single','2024-08-22 05:24:59'),(2,'Mary','unemployed','female','1984-10-06','married','2024-08-22 05:24:59'),(3,'Andy Hii','employed','male','1985-05-15','married','2024-08-22 11:58:27');
/*!40000 ALTER TABLE `applicants` ENABLE KEYS */;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_id` int DEFAULT NULL,
  `scheme_id` int DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status_last_modified_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `applicant_id` (`applicant_id`),
  KEY `scheme_id` (`scheme_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`scheme_id`) REFERENCES `schemes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` (`id`, `applicant_id`, `scheme_id`, `status`, `created_at`, `status_last_modified_at`) VALUES (1,1,1,'approved','2024-08-22 05:27:21',NULL),(2,2,2,'pending','2024-08-22 05:27:21',NULL),(3,2,2,'approved','2024-08-23 06:36:01','2024-08-23 06:44:59');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;

--
-- Table structure for table `benefit_scheme`
--

DROP TABLE IF EXISTS `benefit_scheme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `benefit_scheme` (
  `benefit_id` int NOT NULL,
  `scheme_id` int NOT NULL,
  PRIMARY KEY (`benefit_id`,`scheme_id`),
  KEY `scheme_id` (`scheme_id`),
  CONSTRAINT `benefit_scheme_ibfk_1` FOREIGN KEY (`benefit_id`) REFERENCES `benefits` (`id`) ON DELETE CASCADE,
  CONSTRAINT `benefit_scheme_ibfk_2` FOREIGN KEY (`scheme_id`) REFERENCES `schemes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `benefit_scheme`
--

/*!40000 ALTER TABLE `benefit_scheme` DISABLE KEYS */;
INSERT INTO `benefit_scheme` (`benefit_id`, `scheme_id`) VALUES (1,1),(2,1),(1,2);
/*!40000 ALTER TABLE `benefit_scheme` ENABLE KEYS */;

--
-- Table structure for table `benefits`
--

DROP TABLE IF EXISTS `benefits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `benefits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `benefits`
--

/*!40000 ALTER TABLE `benefits` DISABLE KEYS */;
INSERT INTO `benefits` (`id`, `name`, `amount`) VALUES (1,'SkillsFuture Credits',500.00),(2,'Daily School Meal Vouchers',NULL);
/*!40000 ALTER TABLE `benefits` ENABLE KEYS */;

--
-- Table structure for table `criteria`
--

DROP TABLE IF EXISTS `criteria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `criteria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scheme_id` int NOT NULL,
  `employment_status` enum('employed','unemployed','self-employed') DEFAULT NULL,
  `has_children` tinyint(1) DEFAULT NULL,
  `children_school_level` enum('primary','secondary','tertiary') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `scheme_id` (`scheme_id`),
  CONSTRAINT `criteria_ibfk_1` FOREIGN KEY (`scheme_id`) REFERENCES `schemes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `criteria`
--

/*!40000 ALTER TABLE `criteria` DISABLE KEYS */;
INSERT INTO `criteria` (`id`, `scheme_id`, `employment_status`, `has_children`, `children_school_level`) VALUES (4,1,'unemployed',NULL,NULL),(5,2,'unemployed',1,'primary');
/*!40000 ALTER TABLE `criteria` ENABLE KEYS */;

--
-- Table structure for table `household`
--

DROP TABLE IF EXISTS `household`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `household` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applicant_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `employment_status` enum('employed','unemployed') NOT NULL,
  `sex` enum('male','female') NOT NULL,
  `date_of_birth` date NOT NULL,
  `relation` enum('son','daughter','spouse','parent','sibling') NOT NULL,
  `school_level` enum('primary','secondary','tertiary') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `applicant_id` (`applicant_id`),
  CONSTRAINT `household_ibfk_1` FOREIGN KEY (`applicant_id`) REFERENCES `applicants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `household`
--

/*!40000 ALTER TABLE `household` DISABLE KEYS */;
INSERT INTO `household` (`id`, `applicant_id`, `name`, `employment_status`, `sex`, `date_of_birth`, `relation`, `school_level`) VALUES (1,2,'Gwen','unemployed','female','2016-02-01','daughter','primary'),(2,2,'Jayden','unemployed','male','2018-03-15','son','secondary'),(3,3,'Alison Ting','employed','female','1987-07-10','spouse',NULL),(4,3,'Johnny Hii','unemployed','male','2010-09-12','son','primary');
/*!40000 ALTER TABLE `household` ENABLE KEYS */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` (`id`, `role_name`, `description`) VALUES (1,'Admin','Administrator with full access'),(2,'User','Regular user with limited access'),(4,'Reviewer','Can review applications'),(5,'Processor','Can process applications'),(6,'Approver','Can approve applications');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

--
-- Table structure for table `schemes`
--

DROP TABLE IF EXISTS `schemes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schemes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schemes`
--

/*!40000 ALTER TABLE `schemes` DISABLE KEYS */;
INSERT INTO `schemes` (`id`, `name`, `created_at`) VALUES (1,'Retrenchment Assistance Scheme','2024-08-22 05:25:58'),(2,'Retrenchment Assistance Scheme (families)','2024-08-22 05:25:58');
/*!40000 ALTER TABLE `schemes` ENABLE KEYS */;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` (`id`, `user_id`, `role_id`) VALUES (7,1,4),(8,2,5),(9,3,1);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `password`, `email`, `created_at`) VALUES (1,'john_doe','$2a$10$s2E.QoRSe.4iQ/JgQMhREuyfVBm5a8ntMbeApNAxyG6WdQpKE1nY.','john@example.com','2024-08-21 14:48:33'),(2,'jane_doe','$2a$10$s2E.QoRSe.4iQ/JgQMhREuyfVBm5a8ntMbeApNAxyG6WdQpKE1nY.','jane@example.com','2024-08-21 14:48:33'),(3,'admin','$2a$10$s2E.QoRSe.4iQ/JgQMhREuyfVBm5a8ntMbeApNAxyG6WdQpKE1nY.','admin@example.com','2024-08-21 14:48:33');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-24  1:28:01
