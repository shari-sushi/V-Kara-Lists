import { useEffect, useState } from 'react';
import Link from 'next/link';
import YouTube from 'react-youtube';
import style from '../Youtube.module.css';
import type { SingData } from '../types/singdata'; //type{}で型情報のみインポート 今回は実は不要多分
import DeleteButton from '../components/DeleteButton';

// const Example = () => {
//   const opts = {
//     height: '390',
//     width: '640',
//     playerVars: {
//       // https://developers.google.com/youtube/player_parameters
//       autoplay: 1,
//     },
//   };}

//分割代入？
// 型注釈IndexPage(posts: Post)
function IndexPage( posts : SingData )  {
  // const [data, setData] = useState([]);
  const [data, setData] = useState<SingData[]>([]);

  useEffect(() => {
    //useEffect:関数の実行タイミングをReactのレンダリング後まで遅らせるhook
    fetch('http://localhost:8080/')
      .then(response => response.json())
      .then(data => setData(data))
  }, []);

  return (
      <div>
      <h2>記事一覧</h2>
      <Link href={`/create`} ><u>歌登録</u></Link>
      <table border={4} >
        <thead> {/* ← tabeleのheadタグ */}
          <tr>
            <td>歌ID</td>
            <td>動画タイトル</td>
            <td>動画URL</td>
            <td>歌い出し</td>
            <td>曲名</td>
            <td>詳細/再生</td>
            <td>Edit</td>
            <td>Dele</td>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.unique_id}</td>
              <td>{item.movie}</td>
              <td>{item.url}</td>
              <td>{item.singStart}</td>
              <td>{item.song}</td>
              <td><Link href={`/show?Unique_id=${item.unique_id}`}>再生</Link></td>
              {/* http://localhost:3000/show?Unique_id=1　になった */}
              <td><Link href={`/edit?Unique_id=${item.unique_id}`}>編集</Link></td>
              {/* <td><Link href={`/posts/${item.unique_id}`}>編集</Link></td> */}
              <DeleteButton Unique_id={item.unique_id} />
            </tr>
            ))}
        </tbody>
      </table>
        <div>
        <YouTube videoId="olUzlbAEMyg" />
        </div>
    </div>
  );
}

export default IndexPage;



// golangのプロジェクトディレクトリでhtmlだったころ
// <!DOCTYPE html>
// <html>
//     <head>
//         <meta httpequiv="ContentType"content="text/html;charset=utf8">
//         <title>記事一覧</title>
//     </head>
//     <body>
//         <p><a href="/create">新規作成</a></p>
//         <table border="1">
//             <thead>
//             <tr>
//               <td>固有ID</td>
//               <td>動画タイトル</td>
//               <td>Url</td>
//               <td>歌い出し</td>
// 	          <td>曲名</td>
//               <td>Show</td>
//               <td>Edit</td>
//               <td>Del</td>
//             </tr>
//              </thead>
//              <tbody>
//         {{ range . }}
//             <tr>
//                 <td>{{ .Unique_id }}</td>
//                 <td> {{ .Movie }} </td>
//                 <td> {{ .Url }} </td>
//                 <td> {{ .SingStart }} </td>
//                 <td> {{ .Song }} </td>
//                 <td> <a href="/show?Unique_id={{ .Unique_id }}">表示</a> </td>
//                 <td> <a href="/edit?Unique_id={{ .Unique_id }}">編集</a> </td>
//                 <td> <a href="/delete?Unique_id={{ .Unique_id }}">削除</a> </td>
//             </tr>

//     {{ end }}
//         </tbody>
//         </table>
//     </body>
// </html>


// const Example = () => {
//   const opts = {
//     height: '390',
//     width: '640',
//     playerVars: {
//       // https://developers.google.com/youtube/player_parameters
//       autoplay: 1,
//     },
//   };}


