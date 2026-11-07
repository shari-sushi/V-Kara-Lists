-- #398 本番データ移行: 状態確認（読み取り専用。SELECT のみ）
-- 旧テーブル(movies/karaokes/favorites/original_songs)と新テーブル(videos/video_songs/favorite_videos/favorite_video_songs)の
-- 件数・created_at の範囲・移行時に問題になるデータを出す。
-- テーブルが存在しない場合はそのクエリがエラーになるため、mysql の --force を付けて実行する。

SELECT '== tables ==' AS section;
SELECT table_name, table_rows AS approx_rows
FROM information_schema.tables
WHERE table_schema = DATABASE()
ORDER BY table_name;

-- 本番の実際の定義。scripts/db/rehearsal/legacy_schema.sql（リハーサルで使った旧スキーマ）と突き合わせる。
-- 特に karaokes の UNIQUE KEY karaoke_uq(movie_url, sing_start) と favorites の NULL 許容を確認する。
-- 新テーブルが無ければこの部分はエラーになる（--force で続行する）。
SELECT '== show create table ==' AS section;
SHOW CREATE TABLE movies;
SHOW CREATE TABLE karaokes;
SHOW CREATE TABLE favorites;
SHOW CREATE TABLE videos;
SHOW CREATE TABLE video_songs;
SHOW CREATE TABLE favorite_videos;
SHOW CREATE TABLE favorite_video_songs;

SELECT '== old tables ==' AS section;
SELECT 'movies' AS t, COUNT(*) AS n FROM movies
UNION ALL SELECT 'karaokes', COUNT(*) FROM karaokes
UNION ALL SELECT 'favorites(active)', COUNT(*) FROM favorites WHERE deleted_at IS NULL
UNION ALL SELECT 'favorites(soft_deleted)', COUNT(*) FROM favorites WHERE deleted_at IS NOT NULL
UNION ALL SELECT 'favorites(active,movie)', COUNT(*) FROM favorites WHERE deleted_at IS NULL AND COALESCE(karaoke_id, 0) = 0
UNION ALL SELECT 'favorites(active,karaoke)', COUNT(*) FROM favorites WHERE deleted_at IS NULL AND karaoke_id <> 0
UNION ALL SELECT 'original_songs', COUNT(*) FROM original_songs;

SELECT '== new tables ==' AS section;
SELECT 'videos' AS t, COUNT(*) AS n, MIN(created_at) AS min_created, MAX(created_at) AS max_created FROM videos
UNION ALL SELECT 'video_songs', COUNT(*), MIN(created_at), MAX(created_at) FROM video_songs
UNION ALL SELECT 'favorite_videos', COUNT(*), MIN(created_at), MAX(created_at) FROM favorite_videos
UNION ALL SELECT 'favorite_video_songs', COUNT(*), MIN(created_at), MAX(created_at) FROM favorite_video_songs;

SELECT '== videos by category ==' AS section;
SELECT category, COUNT(*) AS n FROM videos GROUP BY category ORDER BY category;

SELECT '== migration blockers / skipped rows (0 が望ましい) ==' AS section;
-- 新テーブルに同じ movie_url が別カテゴリで登録済み（移行時は新側を優先し、旧 karaokes は付け替えない）
SELECT 'movie_url_conflict_non_karaoke_category' AS check_name, COUNT(*) AS n
FROM movies m JOIN videos v ON v.movie_url = m.movie_url WHERE v.category <> 31
-- 新テーブルに同じ movie_url が歌枠で登録済み（移行時は新側の動画に旧 karaokes をマージする）
UNION ALL SELECT 'movie_url_already_in_videos_as_karaoke', COUNT(*)
FROM movies m JOIN videos v ON v.movie_url = m.movie_url WHERE v.category = 31
-- 同じ動画・同じ開始時刻の旧 karaokes。旧側の karaoke_uq があれば 0 になる。
-- 0 でなければ video_songs の UNIQUE(video_id, sing_start) に違反し、移行全体がロールバックされる → 移行を中止して扱いを決める
UNION ALL SELECT 'karaokes_duplicate_movie_url_sing_start', COUNT(*) FROM (
  SELECT movie_url, sing_start FROM karaokes
  WHERE sing_start IS NOT NULL
  GROUP BY movie_url, sing_start HAVING COUNT(*) > 1
) d
-- 新テーブルの NOT NULL 制約に入らない旧 karaokes（移行対象外になる）
UNION ALL SELECT 'karaokes_null_sing_start', COUNT(*) FROM karaokes WHERE sing_start IS NULL
UNION ALL SELECT 'karaokes_null_song_name', COUNT(*) FROM karaokes WHERE song_name IS NULL
UNION ALL SELECT 'karaokes_null_inputter', COUNT(*) FROM karaokes WHERE karaoke_inputter_id IS NULL
-- 親の movie が無い karaokes / 対象が無い favorites（移行対象外になる）
UNION ALL SELECT 'karaokes_orphan', COUNT(*)
FROM karaokes k WHERE NOT EXISTS (SELECT 1 FROM movies m WHERE m.movie_url = k.movie_url)
UNION ALL SELECT 'favorites_movie_orphan', COUNT(*)
FROM favorites f WHERE f.deleted_at IS NULL AND COALESCE(f.karaoke_id, 0) = 0
  AND NOT EXISTS (SELECT 1 FROM movies m WHERE m.movie_url = f.movie_url)
UNION ALL SELECT 'favorites_karaoke_orphan', COUNT(*)
FROM favorites f WHERE f.deleted_at IS NULL AND f.karaoke_id <> 0
  AND NOT EXISTS (SELECT 1 FROM karaokes k WHERE k.karaoke_id = f.karaoke_id)
-- 移行されない旧 karaokes（NULL 列あり）へのお気に入り（移行対象外になる）
UNION ALL SELECT 'favorites_karaoke_to_skipped_karaoke', COUNT(*)
FROM favorites f JOIN karaokes k ON k.karaoke_id = f.karaoke_id
WHERE f.deleted_at IS NULL AND f.karaoke_id <> 0
  AND (k.sing_start IS NULL OR k.song_name IS NULL OR k.karaoke_inputter_id IS NULL)
-- 旧 karaoke_id が NULL と 0 の両方で同じ動画をお気に入りしている（移行時は1件にまとめる）
UNION ALL SELECT 'favorites_movie_duplicate_null_and_zero', COUNT(*) FROM (
  SELECT listener_id, movie_url FROM favorites
  WHERE deleted_at IS NULL AND COALESCE(karaoke_id, 0) = 0
  GROUP BY listener_id, movie_url HAVING COUNT(*) > 1
) d;
