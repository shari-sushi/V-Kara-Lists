-- #398 リハーサル用: 旧テーブルの架空データ（本番データではない）
-- 移行で扱いを分ける必要があるケースを1件ずつ入れている。
--
-- 想定結果（新テーブルが空の状態から移行した場合）:
--   videos 3（A, B, C）
--   video_songs 5（A の3曲 + B の k4 + C の k8。k5/k6 は NULL 列、k7 は親 movie なしで対象外）
--   favorite_videos 1（listener1 → A。karaoke_id 0 と NULL の重複は1件にまとめる。f3 は論理削除、f7 は対象なし）
--   favorite_video_songs 1（listener1 → k1。f5 は論理削除、f6 は対応する歌唱行なし）

INSERT INTO vtubers (vtuber_id, vtuber_name, vtuber_kana, intro_movie_url, vtuber_inputter_id) VALUES
  (1, 'テストVtuber1', 'てすとぶいちゅーばー1', NULL, 1),
  (2, 'テストVtuber2', 'てすとぶいちゅーばー2', NULL, 1);

INSERT INTO listeners (listener_id, listener_name, email, password) VALUES
  (1, 'listener1', 'listener1@example.com', 'dummy-hash'),
  (2, 'listener2', 'listener2@example.com', 'dummy-hash'),
  (3, 'listener3', 'listener3@example.com', 'dummy-hash');

INSERT INTO movies (movie_url, movie_title, vtuber_id, movie_inputter_id) VALUES
  ('https://www.youtube.com/watch?v=fixtureAAAA', '歌枠A', 1, 1),
  ('https://www.youtube.com/watch?v=fixtureBBBB', '歌枠B', 1, 2),
  ('https://www.youtube.com/watch?v=fixtureCCCC', '歌枠C', 2, 1);

INSERT INTO karaokes (karaoke_id, movie_url, sing_start, song_name, karaoke_inputter_id) VALUES
  (1, 'https://www.youtube.com/watch?v=fixtureAAAA', '00:01:00', '曲A1', 1),
  (2, 'https://www.youtube.com/watch?v=fixtureAAAA', '00:05:00', '曲A2', 1),
  (3, 'https://www.youtube.com/watch?v=fixtureAAAA', '01:10:00', '曲A3', 2),
  (4, 'https://www.youtube.com/watch?v=fixtureBBBB', '00:02:00', '曲B1', 2),
  -- NOT NULL 制約に入らない行
  (5, 'https://www.youtube.com/watch?v=fixtureBBBB', NULL, '曲B2(開始時刻なし)', 2),
  (6, 'https://www.youtube.com/watch?v=fixtureBBBB', '00:03:00', NULL, 2),
  -- 親の movie が無い行
  (7, 'https://www.youtube.com/watch?v=fixtureZZZZ', '00:01:00', '曲Z1', 1),
  (8, 'https://www.youtube.com/watch?v=fixtureCCCC', '00:04:00', '曲C1', 1);

INSERT INTO favorites (id, created_at, updated_at, deleted_at, listener_id, movie_url, karaoke_id) VALUES
  (1, '2024-01-01 10:00:00', '2024-01-01 10:00:00', NULL, 1, 'https://www.youtube.com/watch?v=fixtureAAAA', 0),
  -- 同じ動画への karaoke_id NULL のお気に入り（0 と重複）
  (2, '2023-12-31 09:00:00', '2023-12-31 09:00:00', NULL, 1, 'https://www.youtube.com/watch?v=fixtureAAAA', NULL),
  -- 論理削除済み（解除済み）
  (3, '2024-01-02 10:00:00', '2024-01-03 10:00:00', '2024-01-03 10:00:00', 2, 'https://www.youtube.com/watch?v=fixtureBBBB', 0),
  (4, '2024-01-04 10:00:00', '2024-01-04 10:00:00', NULL, 1, 'https://www.youtube.com/watch?v=fixtureAAAA', 1),
  (5, '2024-01-05 10:00:00', '2024-01-06 10:00:00', '2024-01-06 10:00:00', 2, 'https://www.youtube.com/watch?v=fixtureAAAA', 2),
  -- 移行されない歌唱行(k5)へのお気に入り
  (6, '2024-01-07 10:00:00', '2024-01-07 10:00:00', NULL, 3, 'https://www.youtube.com/watch?v=fixtureBBBB', 5),
  -- 存在しない動画へのお気に入り
  (7, '2024-01-08 10:00:00', '2024-01-08 10:00:00', NULL, 3, 'https://www.youtube.com/watch?v=fixtureZZZZ', 0);
