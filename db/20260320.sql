-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 20, 2026 at 06:48 AM
-- Server version: 10.11.14-MariaDB-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `theorycomputers`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone` varchar(10) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grn_details`
--

CREATE TABLE `grn_details` (
  `id` int(11) NOT NULL,
  `header_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_cost` decimal(10,0) NOT NULL,
  `line_total` decimal(10,0) NOT NULL,
  `note` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grn_details`
--

INSERT INTO `grn_details` (`id`, `header_id`, `item_id`, `quantity`, `unit_cost`, `line_total`, `note`, `created_at`, `updated_at`) VALUES
(48, 36, 50, 2, 100000, 200000, NULL, '2026-03-07 19:47:35', NULL),
(49, 36, 52, 5, 2950, 14750, NULL, '2026-03-07 19:47:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `grn_header`
--

CREATE TABLE `grn_header` (
  `id` int(11) NOT NULL,
  `grn_no` varchar(10) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `po_id` int(11) DEFAULT NULL,
  `invoice_no` varchar(10) DEFAULT NULL,
  `total` decimal(10,0) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `state` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `grn_header`
--

INSERT INTO `grn_header` (`id`, `grn_no`, `supplier_id`, `po_id`, `invoice_no`, `total`, `date`, `created_at`, `updated_at`, `state`) VALUES
(36, 'GRN003', 6, 0, 'INV-45872', 214750, '2026-03-07', '2026-03-07 19:47:35', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `job_details`
--

CREATE TABLE `job_details` (
  `id` int(11) NOT NULL,
  `header_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `device_data` text NOT NULL,
  `problem_data` int(11) NOT NULL,
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_header`
--

CREATE TABLE `job_header` (
  `id` int(11) NOT NULL,
  `job_no` varchar(10) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `state` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mst_brand`
--

CREATE TABLE `mst_brand` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_brand`
--

INSERT INTO `mst_brand` (`id`, `name`, `created_at`, `updated_at`, `state`) VALUES
(1, 'Dell', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(2, 'HP', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(3, 'Lenovo', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(4, 'Asus', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(5, 'Acer', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(6, 'MSI', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(7, 'Apple', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(8, 'Samsung', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(9, 'LG', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(10, 'Intel', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(11, 'AMD', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(12, 'NVIDIA', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(13, 'Gigabyte', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(14, 'ASRock', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(15, 'Corsair', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(16, 'Kingston', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(17, 'ADATA', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(18, 'Crucial', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(19, 'Western Digital', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(20, 'Seagate', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(21, 'SanDisk', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(22, 'Transcend', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(23, 'Logitech', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(24, 'Razer', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(25, 'SteelSeries', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(26, 'HyperX', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(27, 'Cooler Master', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(28, 'Thermaltake', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(29, 'Antec', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(30, 'NZXT', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(31, 'TP-Link', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(32, 'D-Link', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(33, 'Cisco', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(34, 'Ubiquiti', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(35, 'Hikvision', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(36, 'Dahua', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(37, 'Epson', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(38, 'Canon', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(39, 'Brother', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(40, 'Xiaomi', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(41, 'Huawei', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(42, 'ZOTAC', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(43, 'Palit', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(44, 'Gainward', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(45, 'ViewSonic', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(46, 'BenQ', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(47, 'AOC', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(48, 'Redragon', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(49, 'Fantech', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(50, 'Other', '2026-02-20 09:21:41', '2026-02-20 09:21:41', 1),
(51, 'Banda', '2026-02-22 08:36:18', NULL, 1),
(52, 'paka', '2026-03-04 04:59:59', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `mst_category`
--

CREATE TABLE `mst_category` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_category`
--

INSERT INTO `mst_category` (`id`, `name`, `created_at`, `updated_at`, `state`) VALUES
(1, 'Laptops', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(2, 'Desktop Computers', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(3, 'Monitors', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(4, 'Keyboards', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(5, 'Mouse', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(6, 'Printers', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(7, 'Scanners', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(8, 'Projectors', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(9, 'Webcams', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(10, 'Headphones & Audio', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(11, 'Storage Devices', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(12, 'Memory (RAM)', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(13, 'Processors (CPU)', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(14, 'Motherboards', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(15, 'Graphics Cards (GPU)', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(16, 'Power Supplies (PSU)', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(17, 'Computer Cases', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(18, 'Cooling Systems', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(19, 'Networking Devices', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(20, 'Cables & Connectivity', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(21, 'Laptop Accessories', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(22, 'Power & Backup', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(23, 'Office Equipment', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(24, 'Software', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(25, 'Security & Surveillance', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(26, 'Cleaning & Maintenance', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(27, 'Adapters & Converters', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(28, 'Peripheral Accessories', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(29, 'Gaming Accessories', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(30, 'Other Accessories', '2026-02-20 09:20:57', '2026-02-20 09:20:57', 1),
(31, 'Others', '2026-03-03 15:20:47', '2026-03-03 15:20:47', 0),
(32, 'Shiran', '2026-03-03 15:24:00', '2026-03-03 15:24:00', 0),
(33, 'Shiran2', '2026-03-03 15:24:16', '2026-03-03 15:24:16', 0),
(34, 'autodiscover', '2026-03-04 04:10:12', '2026-03-04 04:10:12', 0),
(35, 'Future', '2026-03-07 09:02:58', '2026-03-07 09:02:58', 0),
(36, 'abc', '2026-03-07 12:03:19', '2026-03-07 12:03:19', 0);

-- --------------------------------------------------------

--
-- Table structure for table `mst_items`
--

CREATE TABLE `mst_items` (
  `id` int(11) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `cost` decimal(10,0) NOT NULL,
  `selling` decimal(10,0) NOT NULL,
  `is_serial` tinyint(1) DEFAULT NULL,
  `type` char(1) NOT NULL DEFAULT 'P',
  `reorder_level` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_items`
--

INSERT INTO `mst_items` (`id`, `code`, `name`, `description`, `image`, `category_id`, `brand_id`, `cost`, `selling`, `is_serial`, `type`, `reorder_level`, `created_at`, `updated_at`, `state`) VALUES
(50, 'MACM48256', 'Macbook Air M4 8GB 256GB', 'Macbook Air M4\r\n8GB Ram\r\n256GB SSD\r\nLiquid Ratina Display', '/master/items/appmm8sebrw6dpp.png', 1, 7, 100000, 240000, 1, 'P', 2, '2026-03-02 06:17:21', NULL, 1),
(51, 'ASUS-VB-01', 'Asus VivoBook Ryzen 5 7520U', '– AMD Ryzen 5 7520U Processor\r\n– 512GB M.2 NVMe PCIe 3.0 SSD\r\n– 8GB LPDDR5 RAM\r\n– 15.6″, FHD (1920 x 1080), IPS Display\r\n– AMD Radeon Graphics\r\n– Backlit Chiclet Keyboard\r\n– Windows 11 Home', '/master/items/asummae604ooue7.png', 1, 4, 129000, 175000, 1, 'P', 2, '2026-03-03 09:14:32', NULL, 1),
(52, 'AUDH110', 'Logitech H110 Stereo Headset', 'Input Impedance: 32 Ohms\r\nSensitivity (headphone): 100dB +/-3dB\r\nSensitivity (microphone): -58dBV/μBar, -38dBV/Pa +/-4dB\r\nFrequency response (Headset): 20Hz – 20kHz\r\nFrequency response (Microphone): 100Hz – 16kHz\r\nCable length: 1.8m', '/master/items/htbmmajwkq1y04m.png', 10, 23, 2950, 3200, 0, 'P', 5, '2026-03-03 11:55:09', NULL, 1),
(53, 'CRS-CX500', 'ADATA SU630 480GB SSD', NULL, NULL, 11, 17, 12500, 18000, 0, 'P', 1, '2026-03-05 09:50:31', NULL, 1),
(54, 'CRS-CX500', 'ADATA SU630 480GB SSD', NULL, NULL, 11, 17, 12500, 18000, 0, 'P', 1, '2026-03-05 09:50:53', NULL, 0),
(55, 'WD-1TB-HDD', 'WD Blue 1TB HDD', '1TB Storage Drive, Western Digital', '/master/items/wdbmmdavf0c2rla.png', 11, 19, 11200, 15800, 1, 'P', 5, '2026-03-05 10:05:36', NULL, 1),
(56, 'SND16GB', 'Sandisk 32GB Pen Drive', NULL, NULL, 11, 21, 2450, 3000, 1, 'P', 5, '2026-03-07 12:29:54', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `mst_suppliers`
--

CREATE TABLE `mst_suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `agent` varchar(150) DEFAULT NULL,
  `phone` varchar(12) NOT NULL,
  `whatsapp` varchar(12) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_suppliers`
--

INSERT INTO `mst_suppliers` (`id`, `name`, `agent`, `phone`, `whatsapp`, `email`, `address`, `created_at`, `updated_at`, `state`) VALUES
(1, 'TechZone Lanka (Pvt) Ltd', 'Nimal Perera', '0771234567', '0771234567', 'sales@techzone.lk', 'No. 45, Galle Road, Colombo 03', '2026-02-22 08:31:45', NULL, 1),
(2, 'Global IT Solutions', 'Kasun Silva', '0719876543', '0719876543', 'info@globalit.lk', 'No. 120, High Level Road, Nugegoda', '2026-02-22 08:31:45', NULL, 1),
(3, 'Lanka Computer House', 'Saman Kumara', '0763456789', '0763456789', 'sales@lch.lk', 'No. 88, Main Street, Kandy', '2026-02-22 08:31:45', NULL, 1),
(4, 'Softlogic Information Technologies', 'Chathura Fernando', '0777654321', '0777654321', 'chathura@softlogic.lk', 'No. 14, De Fonseka Place, Colombo 04', '2026-02-22 08:31:45', NULL, 1),
(6, 'Neoview (Pvt) Ltd', 'Lakshan Perera', '0773344556', '0773344556', 'info@neoview.lk', 'No. 55, Main Street, Colombo 05', '2026-02-22 08:32:49', NULL, 1),
(7, 'K-Chord Pvt Ltd', 'Kasun Chiwantha', '0761294262', '0788806670', 'kasunchiwantha789@gmail.com', 'No. 361/23 Parangoda, Dekatana', '2026-03-04 09:55:39', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `mst_users`
--

CREATE TABLE `mst_users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `username` varchar(10) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` tinyint(1) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `state` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mst_users`
--

INSERT INTO `mst_users` (`id`, `first_name`, `last_name`, `username`, `password`, `role`, `image`, `created_by`, `created_at`, `updated_at`, `state`) VALUES
(1, 'root', 'root', 'root', '$2b$10$BWE8CScdiiu9Oro223oMjuH6yS5xznaGVKo.zD5rYZxwLa4P1zsgK', 1, NULL, NULL, '2026-03-13 17:14:07', NULL, 1),
(2, 'Charindu', 'Janith', 'charindu', '$2a$12$hx39mkcPN7MvP0Pht3PO9OvmGp/.IAqEt6e.EgRpxmapMivwuZK4a', 0, NULL, 1, '2026-03-13 17:14:44', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`id`, `item_id`, `quantity`) VALUES
(55, 50, 2),
(56, 52, 5);

-- --------------------------------------------------------

--
-- Table structure for table `stock_items_serials`
--

CREATE TABLE `stock_items_serials` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `serial` varchar(100) NOT NULL,
  `stock` tinyint(1) NOT NULL,
  `reference` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_items_serials`
--

INSERT INTO `stock_items_serials` (`id`, `item_id`, `serial`, `stock`, `reference`, `created_at`, `updated_at`) VALUES
(93, 50, 'MAC1', 1, NULL, '2026-03-07 19:47:36', NULL),
(94, 50, 'MAC2', 1, NULL, '2026-03-07 19:47:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `type` enum('IN','OUT') NOT NULL,
  `quantity` int(11) NOT NULL,
  `reference` enum('OPENING','RETURN','GRN','INVOICE','ADJ') NOT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `note` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `state` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `item_id`, `type`, `quantity`, `reference`, `reference_id`, `note`, `created_at`, `state`) VALUES
(34, 50, 'IN', 2, 'GRN', 48, NULL, '2026-03-07 19:47:36', 1),
(35, 52, 'IN', 5, 'GRN', 49, NULL, '2026-03-07 19:47:37', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `grn_details`
--
ALTER TABLE `grn_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `grn_header_id` (`header_id`),
  ADD KEY `mst_item_id_f` (`item_id`);

--
-- Indexes for table `grn_header`
--
ALTER TABLE `grn_header`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `job_details`
--
ALTER TABLE `job_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `header_id` (`header_id`),
  ADD KEY `d_cat_id` (`category_id`),
  ADD KEY `d_brn_id` (`brand_id`);

--
-- Indexes for table `job_header`
--
ALTER TABLE `job_header`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `mst_brand`
--
ALTER TABLE `mst_brand`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mst_category`
--
ALTER TABLE `mst_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mst_items`
--
ALTER TABLE `mst_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `mst_suppliers`
--
ALTER TABLE `mst_suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mst_users`
--
ALTER TABLE `mst_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`created_by`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_item` (`item_id`);

--
-- Indexes for table `stock_items_serials`
--
ALTER TABLE `stock_items_serials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mst_item_id` (`item_id`);

--
-- Indexes for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grn_details`
--
ALTER TABLE `grn_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `grn_header`
--
ALTER TABLE `grn_header`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `job_details`
--
ALTER TABLE `job_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_header`
--
ALTER TABLE `job_header`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mst_brand`
--
ALTER TABLE `mst_brand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `mst_category`
--
ALTER TABLE `mst_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `mst_items`
--
ALTER TABLE `mst_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `mst_suppliers`
--
ALTER TABLE `mst_suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `mst_users`
--
ALTER TABLE `mst_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `stock_items_serials`
--
ALTER TABLE `stock_items_serials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `grn_details`
--
ALTER TABLE `grn_details`
  ADD CONSTRAINT `grn_header_id` FOREIGN KEY (`header_id`) REFERENCES `grn_header` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mst_item_id_f` FOREIGN KEY (`item_id`) REFERENCES `mst_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `grn_header`
--
ALTER TABLE `grn_header`
  ADD CONSTRAINT `supplier_id` FOREIGN KEY (`supplier_id`) REFERENCES `mst_suppliers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `job_details`
--
ALTER TABLE `job_details`
  ADD CONSTRAINT `d_brn_id` FOREIGN KEY (`brand_id`) REFERENCES `mst_brand` (`id`),
  ADD CONSTRAINT `d_cat_id` FOREIGN KEY (`category_id`) REFERENCES `mst_category` (`id`);

--
-- Constraints for table `job_header`
--
ALTER TABLE `job_header`
  ADD CONSTRAINT `customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `mst_items`
--
ALTER TABLE `mst_items`
  ADD CONSTRAINT `brand_id` FOREIGN KEY (`brand_id`) REFERENCES `mst_brand` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `mst_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `mst_users`
--
ALTER TABLE `mst_users`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`created_by`) REFERENCES `mst_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `item_id_mst` FOREIGN KEY (`item_id`) REFERENCES `mst_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stock_items_serials`
--
ALTER TABLE `stock_items_serials`
  ADD CONSTRAINT `mst_item_id` FOREIGN KEY (`item_id`) REFERENCES `mst_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD CONSTRAINT `item_id` FOREIGN KEY (`item_id`) REFERENCES `mst_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
