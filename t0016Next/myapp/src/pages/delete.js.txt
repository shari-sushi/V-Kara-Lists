<!DOCTYPE html>
<html>
    <head>
        <meta httpequiv="ContentType"content="text/html;charset=utf8">
        <title>記事削除(Unique_id:{{.Unique_id}})</title>
    </head>
    <body>
        <form method="POST" action="delete">
            <input type="hidden" name="Unique_id" value="{{ .Unique_id }}" />
            <p>固有ID : {{.Unique_id}}</p> 
            <p>動画タイトル： {{.Movie}}</p>
            <p>URL : {{.Url}}</p>
            <p>歌い出し：{{.SingStart}}</p>
            <p>曲名：{{.Song}}</p> 
            <!-- nl2br .~~で、改行をHTMLの改行タグ(<br>)に変換する。関数 -->

            <p><input type="submit" value="削除" /> 
                <a href="/index"><input type="button" value="キャンセル" /></a></p>
        </form>
    </body>
</html>