import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { Post } from '../../types/types';

function EditPage({post}) {
  const [data, setData] = useState(post);
  const router = useRouter();
  const { Unique_id } = router.query;

  // console.log("router.queryしたid=", Unique_id);  →undefinedになる

useEffect(() => {
  console.log("useEffect started"); //ok
  console.log("Unique_id=", Unique_id); //1で出力されてる
  if (Unique_id) { //idが定義されている場合に処理
    console.log("Fetching data for Unique_id=", Unique_id);
    fetch(`http://localhost:8080/show?Unique_id=${Unique_id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setData(data); // データをセット
      console.log("id=", Unique_id) //id=1で出力されてる
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation: ', error);
    }), [Unique_id]);

if (!data) {
  // const time = data.singStart;
  return <div>Loading...</div>;
}
  


 {/* 〇getServerSideProps SSG：Server Side Rendering */}
//  export async function Post({ posts }) {
    // console.log(post.id);
    return (
    <div>
      <h2>歌情報編集</h2>
      <ul>
        <li>歌登録ID　　　：</li>{data.unique_id}<br />
        {/* <a>動画タイトル ：</a>{data.movie} <br />
        <a>動画URL　　 ：</a>{data.url}<br />
        <a>歌い出し　　：</a>{data.singStart}<br />
        <a>曲名　　　　：</a>{data.song}<br />
                
        <br />
        
        <Link href={`${data.url}&t=${data.singStart}`}>動画サイト</Link><br />
        {`↑${data.url}&t=${data.singStart}`}<br></br>
        <button color="red" >戻る </button>
        <Link href="/">戻る </Link>
        <Link href={`/edit?Unique_id=${data.unique_id}`}>編集</Link><br /> */}

       </ul>
    </div>
    );
  }

  export async function getStaticProps(context) {
    const Unique_id = context.params.Unique_id;
    const res = await  fetch(`http://localhost:8080/show?Unique_id=${Unique_id}`);
    const posts = await res.json();
    console.log(posts);
    if (!Object.keys(posts).length) {
      return {
        notFound: true,
      };
    }
    return { props: { post: posts } };
  }

  export async function getStaticPaths() {
    const res = await  fetch(`http://localhost:8080/show`);
    const posts = await res.json();

    const paths = posts.map((post) => ({
    params: { Unique_id: post.Unique_id.toString() }, // 文字列に変換
     }));
    return { paths, fallback: true };
    // pathsは各unique?idに対応するパスの配列…事前にビルドするページのパス、静的生成
    // fallback リクエストされたパスのページが生成されてなかった場合の挙動
    // true 対応したページを生成→ビルド後に新しいunique_idが登録されていても対応する
    // fall 404
  }

export default EditPage;