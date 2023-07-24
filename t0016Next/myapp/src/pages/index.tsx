import { useEffect, useState } from 'react';

function HomePage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/')
      .then(response => response.json())
      .then(data => setData(data))
  }, []);

  return (
    <div>
      <h1>記事一覧</h1>
      <table border="1">
        <thead>
          <tr>
            <td>固有ID</td>
            <td>動画タイトル</td>
            <td>Url</td>
            <td>歌い出し</td>
            <td>曲名</td>
            <td>Show</td>
            <td>Edit</td>
            <td>Del</td>
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
              <td><a href={`/show?Unique_id=${item.unique_id}`}>表示</a></td>
              <td><a href={`/edit?Unique_id=${item.unique_id}`}>編集</a></td>
              <td><a href={`/delete?Unique_id=${item.unique_id}`}>削除</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomePage;



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
//                 <!-- ここだけ変更後の反映が遅い -->
//             </tr>

//     {{ end }}
//         </tbody>
//         </table>
//     </body>
// </html>