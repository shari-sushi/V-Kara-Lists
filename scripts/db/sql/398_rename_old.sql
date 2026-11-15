-- #398 後片付け: 旧テーブルを _old にリネームする（DROP はしない）
-- 移行と検証が済み、新コードで問題なく動くことを確認してから実行する。
-- 戻すときは 398_rename_old_down.sql を実行する。
-- RENAME TABLE は複数テーブルをまとめてアトミックに実行する。いずれかが存在しなければ全体が失敗し、何も変わらない。

RENAME TABLE
  movies TO movies_old,
  karaokes TO karaokes_old,
  favorites TO favorites_old,
  original_songs TO original_songs_old;
