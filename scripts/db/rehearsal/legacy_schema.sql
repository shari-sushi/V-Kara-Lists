-- #398 リハーサル用: #414 より前の旧スキーマ（本番の現状に相当）
-- 旧 domain 構造体(66d7f2c^)を GORM AutoMigrate した結果の SHOW CREATE TABLE。データは含まない

CREATE TABLE `favorites` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `listener_id` int NOT NULL,
  `movie_url` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `karaoke_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `favorite_uq` (`listener_id`,`movie_url`,`karaoke_id`),
  KEY `idx_favorites_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `follows` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `follow_listener` int NOT NULL,
  `followed_vtuber` int DEFAULT NULL,
  `followed_listener` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `follow_uq` (`follow_listener`,`followed_vtuber`,`followed_listener`),
  KEY `idx_follows_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `karaokes` (
  `karaoke_id` int NOT NULL AUTO_INCREMENT,
  `movie_url` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sing_start` time DEFAULT NULL,
  `song_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `karaoke_inputter_id` int DEFAULT NULL,
  PRIMARY KEY (`karaoke_id`),
  UNIQUE KEY `karaoke_uq` (`movie_url`,`sing_start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `listeners` (
  `listener_id` int NOT NULL AUTO_INCREMENT,
  `listener_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`listener_id`),
  UNIQUE KEY `email` (`email`),
  KEY `deleted_index` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `movies` (
  `movie_url` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `movie_title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vtuber_id` int NOT NULL,
  `movie_inputter_id` int NOT NULL,
  PRIMARY KEY (`movie_url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `original_songs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `artist_id` int DEFAULT NULL,
  `relesed_at` datetime DEFAULT NULL,
  `inputter_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `delete_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `vtubers` (
  `vtuber_id` int NOT NULL AUTO_INCREMENT,
  `vtuber_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vtuber_kana` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `intro_movie_url` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vtuber_inputter_id` int NOT NULL,
  PRIMARY KEY (`vtuber_id`),
  UNIQUE KEY `vtuber_name` (`vtuber_name`),
  UNIQUE KEY `vtuber_kana` (`vtuber_kana`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

