<!DOCTYPE html>
<html>
    <head>
        <meta httpequiv="ContentType"content="text/html;charset=utf8">
        <title>記事新規作成</title>
    </head>
    <body>
        <form method="POST" action="create">
            <!-- action"create"
            → main関数のhttp.HandleFunc("/create", article.Create)が実行される-->
          
            <!-- type="text"テキスト入力フィールド
            name="moive"サーバー側で使う
            balue=""入力フィールドの初期値は空 -->

            <!-- <p>固有ID : {{ .Unique_id }} </p> -->
            <p>動画タイトル： <input type="text" name="Movie" value="{{.Movie}}" />
            <p>URL : <input type="text" name="url" value="{{.Url}}" /></p>
            <p>歌い出し： <input type="text" name="singStart" value="{{.SingStart}}" /></p>
            <p>曲名： <input type="text" name="song" value={{.Song}}/></p>

            
            <!-- rows 行数、cols 列数のテキスト入力エリア -->
            <p><input type="submit" value="作成" /> 
                <!-- type="submit"送信ボタン, Value=でボタンの表示文字 -->
                <a href="/index"><input type="button" value="戻る" /></a></p>
        </form>
    </body>
</html>

 <!-- unique_id, movie, url, singStart, song -->