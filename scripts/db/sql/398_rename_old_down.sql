-- #398 後片付けの取り消し: 398_rename_old.sql で _old にしたテーブル名を元に戻す

RENAME TABLE
  movies_old TO movies,
  karaokes_old TO karaokes,
  favorites_old TO favorites,
  original_songs_old TO original_songs;
