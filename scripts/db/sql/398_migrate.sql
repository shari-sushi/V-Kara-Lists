-- #398 本番データ移行: 旧テーブル → 新テーブル（差分マージ方式）
--
-- - TRUNCATE しない。8/9 のデプロイ以降に新テーブルへ登録されたデータを保持したまま、未移行の行だけを追加する
-- - 何度実行しても同じ結果になる（自然キーで NOT EXISTS 判定するため、2回目以降は 0 件追加になる）
-- - 1トランザクションで実行する。途中で失敗した場合は全件ロールバックされる
-- - 旧テーブルは読むだけで変更しない（_old へのリネームは 398_rename_old.sql で別途行う）
--
-- 自然キーの対応:
--   movies.movie_url                      → videos.movie_url
--   karaokes(movie_url, sing_start)       → video_songs(video_id, sing_start)
--   favorites(listener_id, movie_url)     → favorite_videos(listener_id, video_id)        ※karaoke_id が 0 または NULL
--   favorites(listener_id, karaoke_id)    → favorite_video_songs(listener_id, video_song_id)

SET @migrated_at = NOW();

START TRANSACTION;

-- movies → videos（歌枠=31）。旧 movies には created_at が無いため移行時刻で埋める
INSERT INTO videos (category, movie_url, title, vtuber_id, inputter_id, created_at, updated_at)
SELECT 31, m.movie_url, m.movie_title, m.vtuber_id, m.movie_inputter_id, @migrated_at, @migrated_at
FROM movies m
WHERE NOT EXISTS (SELECT 1 FROM videos v WHERE v.movie_url = m.movie_url);

-- karaokes → video_songs
-- 新側で同じ movie_url が歌枠以外(単曲など)として登録済みの場合は付け替えない（単曲=1行の不変条件を守るため）
-- NOT NULL 制約に入らない行は対象外にする（件数は 398_inspect.sql / 398_verify.sql で確認する）
INSERT INTO video_songs (video_id, sing_start, song_name, inputter_id, created_at, updated_at)
SELECT v.id, k.sing_start, k.song_name, k.karaoke_inputter_id, @migrated_at, @migrated_at
FROM karaokes k
JOIN videos v ON v.movie_url = k.movie_url AND v.category = 31
WHERE k.sing_start IS NOT NULL
  AND k.song_name IS NOT NULL
  AND k.karaoke_inputter_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM video_songs vs WHERE vs.video_id = v.id AND vs.sing_start = k.sing_start
  );

-- favorites（動画のお気に入り） → favorite_videos
-- 論理削除済み(deleted_at IS NOT NULL)は解除済みのお気に入りなので移行しない
-- 旧データは karaoke_id が 0 と NULL の両方がありうるため、同じ動画への重複は1件にまとめる
INSERT INTO favorite_videos (listener_id, video_id, created_at)
SELECT f.listener_id, v.id, COALESCE(MIN(f.created_at), @migrated_at)
FROM favorites f
JOIN videos v ON v.movie_url = f.movie_url
WHERE f.deleted_at IS NULL
  AND COALESCE(f.karaoke_id, 0) = 0
  AND NOT EXISTS (
    SELECT 1 FROM favorite_videos fv WHERE fv.listener_id = f.listener_id AND fv.video_id = v.id
  )
GROUP BY f.listener_id, v.id;

-- favorites（曲のお気に入り） → favorite_video_songs
-- video_songs.id は旧 karaoke_id と一致しないため、movie_url + sing_start の自然キーで対応付ける
INSERT INTO favorite_video_songs (listener_id, video_song_id, created_at)
SELECT f.listener_id, vs.id, COALESCE(MIN(f.created_at), @migrated_at)
FROM favorites f
JOIN karaokes k ON k.karaoke_id = f.karaoke_id
JOIN videos v ON v.movie_url = k.movie_url
JOIN video_songs vs ON vs.video_id = v.id AND vs.sing_start = k.sing_start
WHERE f.deleted_at IS NULL
  AND f.karaoke_id <> 0
  AND NOT EXISTS (
    SELECT 1 FROM favorite_video_songs fvs WHERE fvs.listener_id = f.listener_id AND fvs.video_song_id = vs.id
  )
GROUP BY f.listener_id, vs.id;

COMMIT;
