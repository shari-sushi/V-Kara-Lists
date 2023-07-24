<!DOCTYPE html>
<html>
    <head>
        <meta httpequiv="ContentType"content="text/html;charset=utf8">
        <title>情報編集(Unique_id:{{.Unique_id}})</title>
    </head>
    <body>
        <form method="POST" action="edit">
             <!-- POSTメソッドを使用してデータを送信し、editというパスに対してアクションする -->
            <input type="hidden" name="Unique_id" value="{{ .Unique_id }}" />
            <!-- hidden 非表示 -->
            <p>固有ID : {{ .Unique_id }} </p>
            <!-- <p>固有ID : <input type=".Unique_id" name=".Unique_id" value="{{.Unique_id}}" /></p> -->
            <p>動画タイトル： <input type="text" name="Movie" value="{{.Movie}}" /></p>
            <p>URL : <input type="text" name="url" value="{{.Url}}" /></p>
            <p>歌い出し： <input type="text" name="singStart" value="{{.SingStart}}" /></p>
            <p>曲名：</p>
            <p><textarea name="song" rows="10" cols="40">{{.Song}}</textarea></p>
            <p><input type="submit" value="更新" /> 
                <a href="/index"><input type="button" value="戻る" /></a></p>
        </form>
    </body>
</html>

<!-- UPDATE KaraokeList SET movie='oimonouta', url='imo', singStart='5:30', song='いもも' WHERE unique_id=3;
-->

<!-- unique_id, movie, url, singStart, song -->

<!-- htmlのフォームデータの送信 -->
<!-- https://developer.mozilla.org/ja/docs/Learn/Forms/Sending_and_retrieving_form_data -->

<!-- --------- -->
<!-- パスにリクエストするって言い方がおかしい
パスってのはただの置き場所でしかないので、ファイル名とかクエリとか諸々追加してしまうとパスではなくなる(URLとかになる)
サーバーにリクエストする、とか、〇〇コントローラーにリクエストする、だったら意味が通じる(命名規則によって自動でルーティングするようになるといちいちパス書かないし)

HTML側で
・ボタン１　登録
・ボタン２　削除
・ボタン３　なんかする

ってあった時に

サーバー側(コントローラー)で
・ハンドラー１、登録
・ハンドラー２、削除　　　　←これ全部アクションと呼ぶ(言語にかかわらずそう呼ぶことになっている)。２はアクション名が削除
・ハンドラーその他 -->