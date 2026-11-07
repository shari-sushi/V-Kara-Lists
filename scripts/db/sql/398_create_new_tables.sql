-- #398 新テーブルの作成（新コードの api を起動する前に実行する）
--
-- 新 api は起動時に GORM AutoMigrate で同じテーブルを作るが、それを待つとデータ移行より前に新 api が公開されてしまう。
-- そのため、移行前に同じ定義のテーブルを先に作っておく。
-- この定義は domain.Video / VideoSong / FavoriteVideo / FavoriteVideoSong を AutoMigrate した結果の SHOW CREATE TABLE と同じにしている。
-- その後に新 api が起動して AutoMigrate が走っても差分は出ない（scripts/db/rehearse-local.sh で検証する）。
-- IF NOT EXISTS なので、すでに存在する場合は何もしない。

CREATE TABLE IF NOT EXISTS `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` tinyint NOT NULL,
  `movie_url` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vtuber_id` int NOT NULL,
  `published_at` datetime DEFAULT NULL,
  `inputter_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `movie_url` (`movie_url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `video_songs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `video_id` int NOT NULL,
  `sing_start` time NOT NULL,
  `song_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `inputter_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `video_song_uq` (`video_id`,`sing_start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `favorite_videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `listener_id` int NOT NULL,
  `video_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `favorite_video_uq` (`listener_id`,`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `favorite_video_songs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `listener_id` int NOT NULL,
  `video_song_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `favorite_video_song_uq` (`listener_id`,`video_song_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
