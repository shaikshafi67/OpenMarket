-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2026 at 06:36 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `open_market`
--

-- --------------------------------------------------------

--
-- Table structure for table `footer_links`
--

CREATE TABLE `footer_links` (
  `id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `label` varchar(150) NOT NULL,
  `url` varchar(500) DEFAULT '#',
  `is_enabled` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `content` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `footer_links`
--

INSERT INTO `footer_links` (`id`, `section_id`, `label`, `url`, `is_enabled`, `sort_order`, `content`) VALUES
(1, 1, 'About Us', '', 1, 1, 'Welcome to OpenMarket — your trusted online marketplace for buying and selling products easily and securely.\n\nAt OpenMarket, we aim to connect buyers and sellers on a single platform where anyone can post ads, discover great deals, and grow their business. Whether you\'re looking to sell unused items or find something valuable at the best price, our platform makes the process simple and efficient.\n\nWe focus on providing a user-friendly experience, fast listings, and reliable communication between users. Our goal is to create a safe and transparent marketplace where users can interact with confidence.\n\nKey Features:\n• Easy ad posting with quick approval\n• Secure and reliable platform\n• Wide range of product categories\n• Direct communication between buyers and sellers\n• Focus on user safety and trust\n\nOur mission is to make online buying and selling accessible to everyone while ensuring trust, convenience, and value in every transaction.\n\nThank you for choosing OpenMarket.\n'),
(2, 3, 'Terms of Use', '#', 1, 2, 'Terms of Use\n\nWelcome to OpenMarket. By using our platform, you agree to the following terms and conditions.\n\n\n\nUser Responsibilities\n\n• Provide accurate and truthful information\n• Use the platform for lawful purposes only\n• Do not post illegal, harmful, or misleading content\n\n\n\nListings & Transactions\n\n• Users are responsible for their own listings\n• OpenMarket does not guarantee the accuracy of listings\n• Buyers and sellers interact at their own risk\n\n\n\nProhibited Activities\n\n• Fraud, scams, or misleading advertisements\n• Posting duplicate or fake listings\n• Harassment or abusive behavior\n• Unauthorized access or misuse of the platform\n\n\n\nAccount Management\n\n• You are responsible for maintaining account security\n• We reserve the right to suspend or terminate accounts for violations\n\n\n\nLimitation of Liability\n\nOpenMarket is not responsible for any loss, damage, or disputes between users. Transactions are conducted directly between buyers and sellers.\n\n\n\nModifications\n\nWe may update these terms at any time. Continued use of the platform means acceptance of updated terms.\n\n\n\nContact Us\n\nEmail: openmarket39@gmail.com\n'),
(3, 3, 'Cookie Policy', '#', 1, 3, 'Cookie Policy\n\nThis Cookie Policy explains how OpenMarket uses cookies to enhance your experience.\n\n\n\nWhat Are Cookies?\n\nCookies are small text files stored on your device to help improve website functionality and performance.\n\n\n\nHow We Use Cookies\n\n• To keep you logged in\n• To remember your preferences\n• To analyze website traffic and usage\n• To improve performance and user experience\n\n\n\nTypes of Cookies We Use\n\n• Essential Cookies: Required for basic functionality\n• Performance Cookies: Help us understand usage and improve the platform\n• Functional Cookies: Remember user preferences\n\n\n\nManaging Cookies\n\nYou can control or disable cookies through your browser settings. However, some features may not work properly if cookies are disabled.\n\n---\n\nUpdates\n\nWe may update this Cookie Policy as needed. Continued use of the platform means you accept the policy.\n\n\n\nContact Us\n\nEmail: openmarket39@gmail.com\n'),
(4, 2, 'Safety Tips', '#', 1, 3, 'Safety Tips\n\nYour safety is our priority. Follow these guidelines to ensure a secure and smooth experience while buying and selling on OpenMarket.\n\n---\n\nGeneral Safety\n\n• Always communicate through the platform before sharing personal details\n• Be cautious of deals that seem too good to be true\n• Never share sensitive information like passwords or OTPs\n\n---\n\nTips for Buyers\n\n• Verify the product details carefully before making a decision\n• Ask for clear photos and complete information\n• Meet the seller in a safe, public location\n• Avoid making advance payments to unknown sellers\n• Check the product before completing the transaction\n\n---\n\nTips for Sellers\n\n• Provide accurate descriptions and real images of your product\n• Be clear about pricing and conditions\n• Meet buyers in safe and public places\n• Do not accept overpayments or suspicious payment methods\n• Avoid sharing personal or banking details unnecessarily\n\n---\n\nOnline Safety\n\n• Beware of phishing links and fake messages\n• Do not click on unknown or suspicious links\n• Always use secure payment methods when available\n• Keep your account credentials private\n\n---\n\nReporting Issues\n\n• Report any suspicious activity, fraud, or misuse immediately\n• Use the report option available on listings or user profiles\n• Contact our support team if you need assistance\n\nEmail: [report@openmarket.com](mailto:report@openmarket.com)\n\n---\n\nRemember\n\nOpenMarket does not guarantee transactions between users. Always take necessary precautions and make informed decisions.\n\nStay alert, stay safe, and enjoy a secure marketplace experience.\n'),
(5, 3, 'Privacy Policy', '#', 1, 1, 'Privacy Policy\n\nAt OpenMarket, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.\n\n\n\nInformation We Collect\n\n• Personal Information: Name, email address, phone number\n• Account Information: Login details and profile data\n• Usage Data: Pages visited, interactions, and activity on the platform\n• Device Information: Browser type, IP address, and device details\n\n\n\nHow We Use Your Information\n\n• To create and manage your account\n• To enable buying and selling on the platform\n• To improve user experience and platform performance\n• To communicate updates, notifications, and support responses\n• To detect and prevent fraud or misuse\n\n\n\nData Sharing\n\n• We do not sell your personal data\n• Information may be shared with service providers for platform operation\n• We may share data if required by law or to protect our users\n\n\n\nData Security\n\nWe use appropriate security measures to protect your data. However, no system is completely secure, and users should also take precautions.\n\n\n\nYour Rights\n\n• Access and update your personal information\n• Request deletion of your account\n• Opt out of non-essential communications\n\n\nCookies\n\nWe use cookies to improve your experience. For more details, refer to our Cookie Policy.\n\n\n\nChanges to Policy\n\nWe may update this policy from time to time. Continued use of the platform means you accept the updated policy.\n\n\nContact Us\n\nEmail: openmarket39@gmail.com\n'),
(6, 2, 'FAQs', '#', 1, 2, 'Frequently Asked Questions (FAQs)\n\nFind answers to the most common questions about using OpenMarket.\n\n\n\nGeneral Questions\n\nQ1. What is OpenMarket?\nOpenMarket is an online marketplace where users can buy and sell products easily and connect directly with each other.\n\nQ2. Is OpenMarket free to use?\nYes, creating an account and browsing listings is free. Some premium features may be introduced in the future.\n\n\n\nAccount & Registration\n\nQ3. How do I create an account?\nClick on the Register option, enter your details, and verify your account to get started.\n\nQ4. I forgot my password. What should I do?\nUse the “Forgot Password” option on the login page and follow the instructions to reset your password.\n\n\n\nBuying\n\nQ5. How can I contact a seller?\nOpen the product listing and use the contact option provided to connect with the seller.\n\nQ6. Is it safe to buy on OpenMarket?\nYes, but always follow safety tips such as verifying product details and avoiding advance payments.\n\n\n\nSelling\n\nQ7. How do I post an ad?\nClick on “Post Ad”, fill in product details, upload images, and publish your listing.\n\nQ8. Can I edit or delete my ad?\nYes, you can manage your listings from your account dashboard.\n\nQ9. How can I sell my product faster?\nUse clear images, detailed descriptions, and set a competitive price.\n\n\n\nSafety & Security\n\nQ10. How do I report a scam or suspicious user?\nUse the “Report” option or contact our support team immediately.\n\nQ11. What safety precautions should I take?\nAvoid sharing personal details, meet in safe locations, and verify users before transactions.\n\n\n\nSupport\n\nQ12. How can I contact OpenMarket support?\nYou can reach us via email at : openmarket39@gmail.com\n\n\n\nIf you have more questions, feel free to contact us. We are here to help you.\n'),
(7, 1, 'Blog', '#', 1, 3, 'Welcome to the OpenMarket Blog\n\nStay updated with the latest tips, guides, and insights about buying, selling, and using OpenMarket effectively. Our blog is designed to help you make smarter decisions, stay safe, and get the best value from our platform.\n\nWhat You’ll Find Here\n\n• Buying Guides\nLearn how to find the best deals, compare products, and make smart purchasing decisions.\n\n• Selling Tips\nDiscover how to create effective listings, set the right price, and sell your items faster.\n\n• Safety & Security\nGet important tips on avoiding scams, verifying buyers/sellers, and ensuring safe transactions.\n\n• Market Trends\nStay informed about trending products, popular categories, and demand insights.\n\n• Platform Updates\nKnow about new features, improvements, and updates on OpenMarket.\n\nFeatured Topics\n\n• How to Write a High-Converting Ad\n• Tips to Sell Your Product Faster\n• How to Avoid Online Marketplace Scams\n• Best Time to Buy and Sell Used Products\n• Beginner’s Guide to Online Selling\n\nOur goal is to provide useful and practical information that helps you succeed on OpenMarket.\n\nKeep learning, stay safe, and make the most of your buying and selling experience.\n'),
(8, 1, 'Careers', '#', 1, 2, 'Join Our Team – Careers at OpenMarket\n\nAt OpenMarket, we are building a platform that connects people and creates opportunities. We are always looking for passionate, talented, and motivated individuals who want to grow with us and make an impact.\n\nWhy Work With Us?\n• Work on a fast-growing digital marketplace\n• Opportunity to learn and grow in a real-world business environment\n• Flexible and collaborative work culture\n• Chance to contribute ideas and build innovative solutions\n\nWho We’re Looking For\nWe welcome individuals who are:\n• Passionate about technology and online platforms\n• Interested in web development, app development, or digital marketing\n• Problem-solvers with a proactive mindset\n• Good communicators and team players\n\nOpen Roles (Example)\n• Frontend Developer (HTML, CSS, JavaScript / React)\n• Backend Developer (Node.js, APIs, Database)\n• UI/UX Designer\n• Digital Marketing Executive\n• Customer Support Executive\n\nHow to Apply\nIf you are interested in joining OpenMarket, send your resume and details to our email or contact us through the website.\n\nEmail: openmarket39@gmail.com\n\nWe believe in growing together. Be a part of our journey.\n'),
(9, 1, 'Contact Us', '#', 1, 4, 'Contact Us\n\nWe’re here to help you with any questions, issues, or feedback related to OpenMarket. Whether you are buying, selling, or exploring our platform, feel free to reach out to us.\n\nCustomer Support\nIf you need assistance with your account, listings, or transactions, contact our support team.\n\nEmail: openmarket39@gmail.com \n\nBusiness & Partnerships\nFor business inquiries, collaborations, or advertising opportunities:\n\nEmail: openmarket39@gmail.com\n\nReport an Issue\nIf you encounter any suspicious activity, scams, or technical problems, please report it immediately.\n\nEmail: openmarket39@gmail.com\n\nWorking Hours\nMonday to Saturday: 9:00 AM – 6:00 PM\nSunday: Closed\n\nAddress\nOpenMarket\nIndia'),
(10, 2, 'Report an Issue', '#', 1, 4, 'Report an Issue\n\nIf you encounter any problem, suspicious activity, or technical error on OpenMarket, please report it immediately. Your report helps us keep the platform safe and reliable.\n\n---\n\nTypes of Issues You Can Report\n\n• Fraud or scam attempts\n• Fake or misleading listings\n• Abusive or inappropriate behavior\n• Payment-related issues\n• Technical problems (bugs, errors, page not loading)\n\n---\n\nSubmit a Report\n\nPlease fill out the form below with accurate details so we can investigate quickly.\n\n[Report Form Fields]\n\n• Full Name\n• Email Address\n• Issue Type (Dropdown: Fraud, Fake Listing, Abuse, Payment Issue, Technical Issue)\n• Listing ID / User ID (if applicable)\n• Description (Explain the issue clearly)\n• Upload Screenshot (optional but recommended)\n\nSubmit Button: Report Issue\n\n---\n\nImportant Guidelines\n\n• Provide clear and honest information\n• Attach screenshots or proof whenever possible\n• Do not submit false or misleading reports\n\n---\n\nWhat Happens Next?\n\n• Our team will review your report\n• We may contact you for additional information\n• Necessary actions will be taken based on our investigation\n\n---\n\nNeed Immediate Help?\n\nIf your issue is urgent, contact us directly:\n\nEmail: [report@openmarket.com](mailto:report@openmarket.com)\n\n---\n\nWe are committed to maintaining a safe and trusted marketplace for all users.\n'),
(11, 2, 'Help Center', '#', 1, 1, 'Help Center\n\nWelcome to the OpenMarket Help Center. Find answers to common questions and learn how to use our platform effectively.\n\n\n\nGetting Started\n\n• How to Create an Account\nSign up using your email and basic details to start buying and selling.\n\n• How to Post an Ad\nClick on “Post Ad”, fill in product details, upload images, and publish your listing.\n\n• How to Contact a Seller\nOpen the product listing and use the contact option to connect directly with the seller.\n\n\n\nBuying on OpenMarket\n\n• How to Find Products\nUse search and filters to explore listings based on your preferences.\n\n• Tips for Safe Buying\nAlways verify product details, meet in safe locations, and avoid advance payments.\n\n\n\nSelling on OpenMarket\n\n• How to Create an Effective Listing\nUse clear titles, detailed descriptions, and high-quality images.\n\n• Pricing Your Product\nSet a competitive price based on market demand and product condition.\n\n• Managing Your Listings\nYou can edit, update, or delete your ads from your account dashboard.\n\n\n\nAccount & Settings\n\n• Updating Profile Information\nGo to your account settings to update your details.\n\n• Password & Security\nKeep your account secure by using a strong password and not sharing login details.\n\n\n\nReport & Safety\n\n• Report Suspicious Activity\nIf you notice any scam or unusual behavior, report it immediately.\n\n• Community Guidelines\nFollow platform rules to maintain a safe and respectful environment.\n\n\n\nStill Need Help?\n\nIf you cannot find your answer, contact our support team:\n\nEmail: openmarket39@gmail.com\n\nWe are here to assist you and ensure a smooth experience on OpenMarket.\n');

-- --------------------------------------------------------

--
-- Table structure for table `footer_sections`
--

CREATE TABLE `footer_sections` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_enabled` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `footer_sections`
--

INSERT INTO `footer_sections` (`id`, `name`, `is_enabled`, `sort_order`) VALUES
(1, 'Company', 1, 1),
(2, 'Help & Support', 1, 2),
(3, 'Legal', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `footer_settings`
--

CREATE TABLE `footer_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `footer_settings`
--

INSERT INTO `footer_settings` (`id`, `setting_key`, `setting_value`) VALUES
(1, 'copyright_text', '© 2026 OpenMarket. All rights reserved.'),
(2, 'country', 'India'),
(3, 'language', 'Telugu');

-- --------------------------------------------------------

--
-- Table structure for table `footer_social`
--

CREATE TABLE `footer_social` (
  `id` int(11) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `url` varchar(500) DEFAULT '#',
  `is_enabled` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `footer_social`
--

INSERT INTO `footer_social` (`id`, `platform`, `icon`, `url`, `is_enabled`, `sort_order`) VALUES
(1, 'WhatsApp', 'wa', 'https://wa.me', 1, 4),
(2, 'Twitter (X)', 'tw', 'https://x.com', 1, 3),
(3, 'Instagram', 'ig', 'https://instagram.com', 1, 2),
(4, 'Facebook', 'fb', 'https://facebook.com', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `message_text` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `file_url` text DEFAULT NULL,
  `message_type` enum('text','image','video','audio') DEFAULT 'text',
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `product_id`, `sender_id`, `receiver_id`, `message_text`, `timestamp`, `file_url`, `message_type`, `is_read`) VALUES
(50, 8, 4, 1, 'hlo', '2026-05-01 11:44:35', NULL, 'text', 1),
(51, 8, 3, 1, '????', '2026-05-01 16:03:23', NULL, 'text', 1),
(52, 8, 3, 1, '????', '2026-05-01 16:03:30', NULL, 'text', 1),
(53, 8, 3, 1, 'hlo', '2026-05-01 16:03:39', NULL, 'text', 1),
(54, 9, 3, 4, '❤️', '2026-05-01 16:07:30', NULL, 'text', 0),
(55, 9, 3, 4, '????', '2026-05-01 16:07:38', NULL, 'text', 0),
(56, 8, 1, 3, 'hlo', '2026-05-01 16:17:33', NULL, 'text', 0),
(57, 9, 1, 4, 'hlo', '2026-05-01 16:24:53', NULL, 'text', 0),
(58, 8, 7, 1, 'hlo', '2026-05-02 02:21:51', NULL, 'text', 1),
(59, 37, 10, 7, 'hlo', '2026-05-02 04:12:29', NULL, 'text', 1),
(60, 15, 11, 1, 'hlo', '2026-05-02 08:50:58', NULL, 'text', 0),
(61, 35, 11, 8, 'hl', '2026-05-02 11:40:28', NULL, 'text', 0);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `is_read`, `created_at`) VALUES
(2, 1, '???? Your Ad is Live!', 'Great news! Your ad \"Men Self Design Polo Collar Cotton T-shirt\" has been approved by the OpenMarket Team and is now live on the marketplace. Buyers can now see and contact you about it.', 1, '2026-04-20 10:33:36'),
(3, 1, 'Men Self Design Polo Collar Cotton T-shirt', 'Your ad has been removed by the OpenMarket Team. If you have any questions or concerns, please contact us at support@openmarket.in', 1, '2026-04-20 10:39:00'),
(4, 1, 'Black Pant', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-04-21 07:17:02'),
(5, 1, 'Black Pant', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-04-28 14:30:20'),
(6, 4, 'Kurti', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-01 15:26:01'),
(7, 3, 'good', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-01 15:33:21'),
(9, 3, 'Women’s Blue Embroidered Kurti Set with Dupatta ', 'Your ad has been removed by the OpenMarket Team. If you have any questions or concerns, please contact us at support@openmarket.in', 0, '2026-05-02 02:18:28'),
(14, 1, 'Adjustable book shelf ', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 02:51:31'),
(15, 9, 'Elsa Hair Extensions – New Pack', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 02:59:32'),
(16, 8, 'Table and chair set for sale ', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 02:59:33'),
(17, 7, 'Wireless microphone for sale', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 02:59:34'),
(18, 9, 'Double Bed Mattress ', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 03:02:13'),
(19, 10, 'Water Delivery Service  Pure Drinking Water', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 03:06:03'),
(20, 10, 'Work From Home Telecaller Job – Flexible Hours', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 03:14:32'),
(21, 8, 'Electric Kettle', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 03:14:33'),
(22, 8, 'Electric Rice Cooker', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 03:14:34'),
(23, 8, '2 Burner Gas Stove ', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 03:14:35'),
(24, 10, 'iPhone Purple With Box Good Condition', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 03:36:37'),
(25, 7, 'Designer Tote Bag', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 03:36:38'),
(26, 7, 'Luxury Handbag', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 03:36:39'),
(27, 7, 'Stylish Shoulder Bag', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 03:36:40'),
(28, 8, 'Puma Sneakers', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 03:36:41'),
(29, 8, 'Sofa Cum Bed', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 03:36:42'),
(30, 7, 'Mini Tripod Stand', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 03:36:43'),
(31, 8, 'Mi Smart LED TV', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 03:36:44'),
(32, 8, 'Used Bike', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 03:36:45'),
(33, 8, 'Hyundai Creta', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 03:36:48'),
(34, 8, 'Audi Car', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 03:36:49'),
(35, 8, 'Honda Bike', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 03:36:50'),
(36, 7, 'Harry Potter Book', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 04:10:56'),
(37, 7, 'Lady Anna Book', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 04:10:57'),
(38, 8, 'Mini Pickup Truck', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 0, '2026-05-02 04:10:58'),
(40, 11, 'Car', 'Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.', 1, '2026-05-02 11:37:42');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `seller_id`, `title`, `description`, `price`, `location`, `category`, `image_url`, `video_url`, `is_approved`, `created_at`) VALUES
(8, 1, 'Black Pant', 'The blac pant', 699.00, 'Andhra Pradesh', 'Fashion', '[\"/uploads/1776755774778-403f5294-bfd1-4fcf-9517-8d0b464270d11678866110473KottyWomenBlackRelaxedStraightFitHigh-RiseEasyWashTrousers3.jpg\",\"/uploads/1776755774788-c9358593-c31b-4ef1-acd8-cb375d10151a1678866110461KottyWomenBlackRelaxedStraightFitHigh-RiseEasyWashTrousers2.jpg\",\"/uploads/1776755964002-00178bda-6a20-4dc3-aa30-3dd4cca941c61678866110523KottyWomenBlackRelaxedStraightFitHigh-RiseEasyWashTrousers6.jpg\"]', NULL, 1, '2026-04-21 07:16:14'),
(9, 4, 'Women’s Blue Embroidered Kurti Set with Dupatta', 'Beautiful blue kurti set with fine embroidery, includes matching pants and dupatta. Perfect for festive and casual occasions, well maintained and stylish.', 150.00, 'Gujarat', 'Fashion', '[\"/uploads/1777649141602-WhatsApp Image 2026-04-29 at 5.02.27 PM.jpeg\",\"/uploads/1777649141620-WhatsApp Image 2026-04-29 at 5.02.28 PM.jpeg\",\"/uploads/1777649141627-WhatsApp Image 2026-04-29 at 5.02.28 PM (1).jpeg\",\"/uploads/1777649141633-WhatsApp Image 2026-04-29 at 5.02.27 PM (1).jpeg\"]', NULL, 1, '2026-05-01 15:25:41'),
(11, 7, 'Women’s Green Ribbed Top', 'Product Name: Women’s Ribbed Top  \r\nCategory: Fashion  \r\n\r\nCondition: Like New  \r\nSize: M (mention exact if known)  \r\nColor: Olive Green  \r\n\r\nDetails:\r\n- Soft ribbed fabric with stretch\r\n- Trendy loose fit with side detailing\r\n- Comfortable for daily wear\r\n- Lightweight and breathable\r\n- No damage, well maintained\r\n\r\nReason for Selling:\r\nNot using / Extra piece  ', 200.00, 'Gujarat', 'Fashion', '[\"/uploads/1777687605049-Zzi77HNi_b2c6eba201de444396f4893dfcabc39e.jpg\",\"/uploads/1777687605050-pRFrbTP0_8fb8d1e6f92949d59dbdb52c758cbb89.jpg\",\"/uploads/1777687605053-wOO8S83q_c1d1ca799dcf4467ac322e3aed46d53a.jpg\"]', NULL, 1, '2026-05-02 02:06:45'),
(12, 7, 'Women’s Cream Embroidered Casual Shirt', 'Elegant cream shirt with floral embroidery, soft fabric and perfect for daily wear. Well maintained, comfortable fit and trendy look.', 199.00, 'Gujarat', 'Fashion', '[\"/uploads/1777688489396-9TtkiShM_600c6067c72740afb4482c111eeb4629.jpg\",\"/uploads/1777688489398-BupGqwoV_796c693938604a24a7629be6f4d84914.jpg\"]', NULL, 1, '2026-05-02 02:21:29'),
(13, 7, 'Vivo Smartphone Good Condition –Smooth Performance', 'Well maintained Vivo phone with good camera and battery backup, no major issues. Smooth performance, ready to use for daily needs.', 2500.00, 'Gujarat', 'Mobiles', '[\"/uploads/1777689126124-prod-20220514-1648286918811544477710459-jpg.jpg\"]', NULL, 1, '2026-05-02 02:24:28'),
(14, 7, 'iPhone Red Color Good Condition', 'Well maintained iPhone in attractive red color with good camera and battery backup. No major issues, smooth performance and ready to use.', 4999.00, 'Gujarat', 'Mobiles', '[\"/uploads/1777689287854-IMG_1194-scaled-1080x1080.jpg\"]', NULL, 1, '2026-05-02 02:34:47'),
(15, 1, 'Adjustable book shelf ', 'Colour - dark brown \r\nType - open type \r\nMaterial - engineered wood', 500.00, 'Andhra Pradesh', 'Furniture', '[\"/uploads/1777690280604-WhatsApp Image 2026-04-30 at 5.41.04 PM.jpeg\",\"/uploads/1777690280604-WhatsApp Image 2026-04-30 at 5.41.05 PM.jpeg\",\"/uploads/1777690280609-WhatsApp Image 2026-04-30 at 5.41.06 PM.jpeg\"]', NULL, 1, '2026-05-02 02:51:20'),
(16, 7, 'Wireless microphone for sale', '\r\nCondition 80%', 400.00, 'Gujarat', 'Electronics & Appliances', '[\"/uploads/1777690423601-WhatsApp Image 2026-04-30 at 7.32.37 PM.jpeg\"]', NULL, 1, '2026-05-02 02:53:43'),
(17, 8, 'Table and chair set for sale ', 'Condition 80%good', 3500.00, 'Arunachal Pradesh', 'Furniture', '[\"/uploads/1777690579484-WhatsApp Image 2026-04-30 at 7.55.15 PM.jpeg\",\"/uploads/1777690579485-ch.jpeg\"]', NULL, 1, '2026-05-02 02:56:19'),
(18, 9, 'Elsa Hair Extensions – New Pack', 'High-quality hair extensions with natural look and soft texture. Brand new pack, perfect for stylish hairstyles and daily use.', 200.00, 'Goa', 'Fashion', '[\"/uploads/1777690762235-WhatsApp Image 2026-04-30 at 8.33.41 PM.jpeg\",\"/uploads/1777690762236-WhatsApp Image 2026-04-30 at 8.33.40 PM.jpeg\"]', NULL, 1, '2026-05-02 02:59:22'),
(19, 9, 'Double Bed Mattress ', 'Comfortable mattress suitable for daily use, clean and well maintained. Ideal for floor or bed, no major damage.', 749.00, 'Goa', 'Furniture', '[\"/uploads/1777690917851-WhatsApp Image 2026-05-01 at 11.39.27 AM.jpeg\"]', NULL, 1, '2026-05-02 03:01:57'),
(20, 10, 'Water Delivery Service  Pure Drinking Water', 'Fresh and clean drinking water delivered to your doorstep with fast service. Affordable pricing with no hidden charges, available daily.\n', 370.00, 'Andhra Pradesh', 'Services', '[\"/uploads/1777691157090-WhatsApp Image 2026-05-01 at 11.53.53 AM.jpeg\"]', NULL, 1, '2026-05-02 03:05:57'),
(21, 10, 'Work From Home Telecaller Job – Flexible Hours', 'Telecaller job opportunity with flexible working hours and good earning potential from home. No office required, basic communication skills needed.', 998.00, 'Arunachal Pradesh', 'Jobs', '[\"/uploads/1777691328336-WhatsApp Image 2026-05-01 at 12.19.17 PM.jpeg\"]', NULL, 1, '2026-05-02 03:08:48'),
(22, 8, '2 Burner Gas Stove ', 'Well maintained gas stove with strong burners and smooth knobs. Works perfectly, ideal for daily cooking with no major issues.', 499.00, 'Andhra Pradesh', 'Electronics & Appliances', '[\"/uploads/1777691468147-WhatsApp Image 2026-05-01 at 1.41.57 PM.jpeg\"]', NULL, 1, '2026-05-02 03:11:08'),
(23, 8, 'Electric Kettle', 'Used electric kettle in good condition, heats water quickly and works perfectly. Ideal for daily use, minor signs of use but no issues.', 199.00, 'Arunachal Pradesh', 'Electronics & Appliances', '[\"/uploads/1777691578666-er.jpeg\"]', NULL, 1, '2026-05-02 03:12:58'),
(24, 8, 'Electric Rice Cooker', 'Used rice cooker in good working condition, cooks rice perfectly and easy to use. Minor usage marks but no functional issues, ideal for daily cooking.', 499.00, 'Arunachal Pradesh', 'Electronics & Appliances', '[\"/uploads/1777691646733-WhatsApp Image 2026-05-01 at 3.50.59 PM.jpeg\"]', NULL, 1, '2026-05-02 03:14:06'),
(25, 10, 'iPhone Purple With Box Good Condition', 'Well maintained iPhone with original box, clean body and smooth performance. Good camera and battery backup, ready to use with no major issues.', 6999.00, 'Andhra Pradesh', 'Mobiles', '[\"/uploads/1777691811607-WhatsApp Image 2026-05-01 at 4.06.04 PM.jpeg\"]', NULL, 1, '2026-05-02 03:16:51'),
(26, 7, 'Luxury Handbag', 'Stylish mini handbag with premium design, comes with box and dust bag. Perfect for parties and daily fashion use, elegant and trendy look.', 499.00, 'Gujarat', 'Fashion', '[\"/uploads/1777691982959-WhatsApp Image 2026-05-01 at 4.51.05 PM.jpeg\"]', NULL, 1, '2026-05-02 03:19:42'),
(27, 7, 'Designer Tote Bag', 'Spacious and stylish tote bag with premium finish, comes with dust cover and carry bag. Perfect for daily use, office, and travel with elegant look.', 599.00, 'Gujarat', 'Fashion', '[\"/uploads/1777692047781-WhatsApp Image 2026-05-01 at 4.51.07 PM.jpeg\"]', NULL, 1, '2026-05-02 03:20:47'),
(28, 7, 'Stylish Shoulder Bag', 'Elegant shoulder bag with premium design and compact size, perfect for daily use. Comes with box and accessories, stylish and easy to carry.', 499.00, 'Gujarat', 'Fashion', '[\"/uploads/1777692121020-WhatsApp Image 2026-05-01 at 4.51.09 PM.jpeg\"]', NULL, 1, '2026-05-02 03:22:01'),
(29, 8, 'Puma Sneakers', 'Trendy Puma shoes with comfortable fit and durable sole, perfect for daily wear. Clean condition and stylish design for casual use.', 999.00, 'Arunachal Pradesh', 'Fashion', '[\"/uploads/1777692213061-WhatsApp Image 2026-05-01 at 5.52.28 PM.jpeg\"]', NULL, 1, '2026-05-02 03:23:33'),
(30, 8, 'Sofa Cum Bed', 'Comfortable sofa that converts into a bed, perfect for home use. Well maintained with minor usage marks, strong and durable for daily use.', 499.00, 'Arunachal Pradesh', 'Fashion', '[\"/uploads/1777692358964-WhatsApp Image 2026-04-30 at 4.33.06 PM.jpeg\",\"/uploads/1777692358964-WhatsApp Image 2026-04-30 at 4.33.04 PM.jpeg\"]', NULL, 1, '2026-05-02 03:25:58'),
(31, 7, 'Mini Tripod Stand', 'Compact tripod stand with adjustable angle, easy to carry with storage case. Good condition and perfect for mobile photography and videos.', 249.00, 'Arunachal Pradesh', 'Electronics & Appliances', '[\"/uploads/1777692459769-WhatsApp Image 2026-04-30 at 4.49.21 PM.jpeg\",\"/uploads/1777692459770-WhatsApp Image 2026-04-30 at 4.49.22 PM.jpeg\"]', NULL, 1, '2026-05-02 03:27:39'),
(32, 8, 'Mi Smart LED TV', 'Well maintained Mi smart TV with clear display and smooth performance. No major issues, perfect for home entertainment and ready to use.', 2499.00, 'Andhra Pradesh', 'Electronics & Appliances', '[\"/uploads/1777692546838-WhatsApp Image 2026-04-30 at 8.12.52 AM.jpeg\"]', NULL, 1, '2026-05-02 03:29:06'),
(33, 8, 'Used Bike', 'Well maintained bike with smooth engine and good mileage. No major issues, ready for daily use and long rides.', 29999.00, 'Arunachal Pradesh', 'Bikes', '[\"/uploads/1777692682720-hari-hara-bike-bazar-kukatpally-hyderabad-second-hand-motorcycle-dealers-n7q97xz0mm.avif\"]', NULL, 1, '2026-05-02 03:31:22'),
(34, 8, 'Honda Bike', 'Well maintained Honda bike with good mileage and smooth engine performance. No major issues, perfect for daily use and long rides.', 24998.00, 'Arunachal Pradesh', 'Bikes', '[\"/uploads/1777692802542-bike-spare-parts.jpeg\"]', NULL, 1, '2026-05-02 03:33:22'),
(35, 8, 'Hyundai Creta', 'Well maintained Hyundai Creta with smooth engine and good mileage. Clean interior, no major issues, perfect for daily use and long drives.', 99999.00, 'Arunachal Pradesh', 'Cars', '[\"/uploads/1777692892889-hyundai-second-hand-cars.jpeg\"]', NULL, 1, '2026-05-02 03:34:52'),
(36, 8, 'Audi Car', 'Well maintained Audi car with powerful engine and smooth driving experience. Clean interior, premium features and perfect for comfort and performance.', 300000.00, 'Arunachal Pradesh', 'Cars', '[\"/uploads/1777692985494-product-jpeg.jpg\"]', NULL, 1, '2026-05-02 03:36:25'),
(37, 7, 'Harry Potter Book', 'Popular Harry Potter novel in good condition, pages are clean and well maintained. Perfect for reading and collection.', 99.00, 'Andhra Pradesh', 'Books, Sports & Hobbies', '[\"/uploads/1777693186582-79.jpg\"]', NULL, 1, '2026-05-02 03:39:46'),
(38, 7, 'Lady Anna Book', 'Classic novel in good condition with clean pages and well maintained cover. Perfect for reading and book collection.', 99.00, 'Chhattisgarh', 'Books, Sports & Hobbies', '[\"/uploads/1777693272918-1.webp-20250410123557.webp\"]', NULL, 1, '2026-05-02 03:41:12'),
(39, 8, 'Mini Pickup Truck', 'Well maintained pickup vehicle with strong engine and good load capacity. Perfect for business use and daily transport, no major issues.', 499.00, 'Andhra Pradesh', 'Commercial Vehicles & Spares', '[\"/uploads/1777693459147-images.jpg\"]', NULL, 1, '2026-05-02 03:44:19'),
(40, 7, 'House for Sale', 'Spacious house in a good residential area with all basic facilities nearby. Well maintained property, ideal for family living.', 999999.00, 'Arunachal Pradesh', 'Properties', '[\"/uploads/1777693623311-images (1).jpg\"]', NULL, 1, '2026-05-02 03:47:03'),
(41, 11, 'Car', 'The best car', 1999998.00, 'Andhra Pradesh', 'Cars', '[\"/uploads/1777721848048-hyundai-second-hand-cars.jpeg\"]', NULL, 1, '2026-05-02 11:37:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'SHAIK SHAFI', 'shaikshafi6288@gmail.com', 'Shafi@143', 'user', '2026-04-08 09:48:29'),
(2, 'Admin', 'admin@gmail.com', 'Shafi@143', 'admin', '2026-04-08 10:02:24'),
(3, 'USER', 'user@gmail.com', 'Shafi@143', 'user', '2026-04-12 06:12:51'),
(4, 'SHAFI', 'user2@gmail.com', 'Shafi@143', 'user', '2026-04-12 07:34:58'),
(7, 'HEMA', 'hema@gmail.com', 'Shafi@143', 'user', '2026-05-02 02:01:54'),
(8, 'BHANU', 'bhanu@gmail.com', 'Shafi@143', 'user', '2026-05-02 02:54:37'),
(9, 'ASMA', 'asma@gmail.com', 'Shafi@143', 'user', '2026-05-02 02:57:19'),
(10, 'PAVAN', 'pavan@gmail.com', 'Shafi@143', 'user', '2026-05-02 03:03:56'),
(11, 'Shafi', 'cooldrink76@gmail.com', 'naidu@14325', 'user', '2026-05-02 05:46:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `footer_links`
--
ALTER TABLE `footer_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `footer_sections`
--
ALTER TABLE `footer_sections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `footer_settings`
--
ALTER TABLE `footer_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `footer_social`
--
ALTER TABLE `footer_social`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `footer_links`
--
ALTER TABLE `footer_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `footer_sections`
--
ALTER TABLE `footer_sections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `footer_settings`
--
ALTER TABLE `footer_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `footer_social`
--
ALTER TABLE `footer_social`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
