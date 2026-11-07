-- #398 リハーサル用: 新コードのデプロイ後、移行前に新テーブルへ登録されたデータ（架空）
-- 本番では未デプロイの見込みだが、「デプロイ後に移行する」場合でも TRUNCATE せず安全に移行できることを確かめる。
--
-- 想定結果（fixture_legacy_data.sql と合わせて移行した場合）:
--   videos 4（既存 B/C/D + 移行 A。B は旧と同じ URL なので追加しない）
--   video_songs 7（既存4 + A の3曲。k4 は B に同じ開始時刻があるので追加しない。k8 は C が単曲カテゴリなので付け替えない）
--   favorite_videos 2（既存 listener2 → D + 移行 listener1 → A）
--   favorite_video_songs 1（移行 listener1 → k1）

INSERT INTO videos (id, category, movie_url, title, vtuber_id, published_at, inputter_id, created_at, updated_at) VALUES
  -- 旧 movies と同じ URL を歌枠として新規登録
  (1, 31, 'https://www.youtube.com/watch?v=fixtureBBBB', '歌枠B(新規登録)', 1, NULL, 3, '2026-09-01 12:00:00', '2026-09-01 12:00:00'),
  -- 旧 movies と同じ URL を歌ってみた(単曲)として新規登録
  (2, 12, 'https://www.youtube.com/watch?v=fixtureCCCC', '歌ってみたC', 2, NULL, 3, '2026-09-02 12:00:00', '2026-09-02 12:00:00'),
  (3, 11, 'https://www.youtube.com/watch?v=fixtureDDDD', 'オリ曲D', 2, NULL, 3, '2026-09-03 12:00:00', '2026-09-03 12:00:00');

INSERT INTO video_songs (id, video_id, sing_start, song_name, inputter_id, created_at, updated_at) VALUES
  (1, 1, '00:02:00', '曲B1(新規登録)', 3, '2026-09-01 12:00:00', '2026-09-01 12:00:00'),
  (2, 1, '00:07:00', '曲B3(新規のみ)', 3, '2026-09-01 12:00:00', '2026-09-01 12:00:00'),
  (3, 2, '00:00:00', '歌ってみたC', 3, '2026-09-02 12:00:00', '2026-09-02 12:00:00'),
  (4, 3, '00:00:00', 'オリ曲D', 3, '2026-09-03 12:00:00', '2026-09-03 12:00:00');

INSERT INTO favorite_videos (id, listener_id, video_id, created_at) VALUES
  (1, 2, 3, '2026-09-04 12:00:00');
