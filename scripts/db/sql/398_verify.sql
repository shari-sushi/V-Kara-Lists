-- #398 本番データ移行: 移行後の検証（読み取り専用。SELECT のみ）
-- missing_* と single_song_* は 0 であること。skipped_* は 398_inspect.sql で事前に把握した件数と一致すること。

SELECT check_name, n FROM (
  -- 旧 movies のうち、新 videos に対応が無いもの
  SELECT 1 AS ord, 'missing_videos' AS check_name, COUNT(*) AS n
  FROM movies m
  WHERE NOT EXISTS (SELECT 1 FROM videos v WHERE v.movie_url = m.movie_url)

  -- 移行対象の旧 karaokes のうち、新 video_songs に対応が無いもの
  UNION ALL SELECT 2, 'missing_video_songs', COUNT(*)
  FROM karaokes k
  JOIN videos v ON v.movie_url = k.movie_url AND v.category = 31
  WHERE k.sing_start IS NOT NULL AND k.song_name IS NOT NULL AND k.karaoke_inputter_id IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM video_songs vs WHERE vs.video_id = v.id AND vs.sing_start = k.sing_start)

  -- 有効な動画お気に入りのうち、新 favorite_videos に対応が無いもの
  UNION ALL SELECT 3, 'missing_favorite_videos', COUNT(*)
  FROM favorites f
  JOIN videos v ON v.movie_url = f.movie_url
  WHERE f.deleted_at IS NULL AND COALESCE(f.karaoke_id, 0) = 0
    AND NOT EXISTS (SELECT 1 FROM favorite_videos fv WHERE fv.listener_id = f.listener_id AND fv.video_id = v.id)

  -- 有効な曲お気に入りのうち、新 favorite_video_songs に対応が無いもの
  UNION ALL SELECT 4, 'missing_favorite_video_songs', COUNT(*)
  FROM favorites f
  JOIN karaokes k ON k.karaoke_id = f.karaoke_id
  JOIN videos v ON v.movie_url = k.movie_url
  JOIN video_songs vs ON vs.video_id = v.id AND vs.sing_start = k.sing_start
  WHERE f.deleted_at IS NULL AND f.karaoke_id <> 0
    AND NOT EXISTS (SELECT 1 FROM favorite_video_songs fvs WHERE fvs.listener_id = f.listener_id AND fvs.video_song_id = vs.id)

  -- 単曲カテゴリ(11/12)の動画が歌唱行をちょうど1件持つこと（移行で崩していないか）
  UNION ALL SELECT 5, 'single_song_videos_without_exactly_one_song', COUNT(*)
  FROM videos v
  WHERE v.category IN (11, 12)
    AND (SELECT COUNT(*) FROM video_songs vs WHERE vs.video_id = v.id) <> 1

  -- 移行対象外になった旧データ（事前確認の件数と一致すればよい）
  UNION ALL SELECT 6, 'skipped_karaokes_null_columns', COUNT(*)
  FROM karaokes WHERE sing_start IS NULL OR song_name IS NULL OR karaoke_inputter_id IS NULL
  UNION ALL SELECT 7, 'skipped_karaokes_non_karaoke_video', COUNT(*)
  FROM karaokes k JOIN videos v ON v.movie_url = k.movie_url WHERE v.category <> 31
  UNION ALL SELECT 8, 'skipped_karaokes_orphan', COUNT(*)
  FROM karaokes k WHERE NOT EXISTS (SELECT 1 FROM movies m WHERE m.movie_url = k.movie_url)
  UNION ALL SELECT 9, 'skipped_favorites_soft_deleted', COUNT(*)
  FROM favorites WHERE deleted_at IS NOT NULL
) checks
ORDER BY ord;

SELECT 'videos' AS t, COUNT(*) AS n FROM videos
UNION ALL SELECT 'video_songs', COUNT(*) FROM video_songs
UNION ALL SELECT 'favorite_videos', COUNT(*) FROM favorite_videos
UNION ALL SELECT 'favorite_video_songs', COUNT(*) FROM favorite_video_songs;
