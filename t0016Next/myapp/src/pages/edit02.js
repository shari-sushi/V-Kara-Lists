import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {  SingData } from '../types/types';
import { useForm } from 'react-hook-form';


// function EditPage({ posts }: { posts: Post[] }) 
function EditPage({post}) {
  const [data, setData] = useState(post);
  //dataというstate(状態)を定義、初期値をpostとした。setDataで更新できる
  const router = useRouter();
  //現在のルーティング(url)を取得。
  const { Unique_id } = router.query;
  //routerからUnique_idを取得
  // console.log("router.queryしたid=", Unique_id);  →undefinedになる

useEffect(() => {
  console.log("useEffect started"); //出力されてない…show.jsの方が取得されてる
  console.log("Unique_id=", Unique_id); //正しく出力された
  if (Unique_id) { //idが定義されている場合に処理
    console.log("Fetching data for Unique_id=", Unique_id);
    fetch(`http://localhost:8080/edit?Unique_id=${Unique_id}`)
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
    })}}, [Unique_id]);
    
  
    if (!data) {
      // const time = data.singStart;
      return <div>Loading...</div>;
    }


  // const Input= () => {
  //   return (
  //     <h1>インプットフィールドの練習</h1>
  //     );
  // }
  //↓
//   <div className={styles.container}>
//   <h1>person-web</h1>
//   <input 
//     type="text" 
//     className={styles.item}
//   />
//   <input 
//     type="text" 
//     className={styles.item}
//   />
// </div>
      
// 〇getServerSideProps SSG：Server Side Rendering
//  export async function Post({ posts }) {
    // console.log(post.id);
    return (
       <div>
      
      <title>編集(歌登録id={data.unique_id})</title>

          <p>歌登録ID : {data.unique_id } </p>
    
      <input type="text" value={data.movie} size="50" /><br />
      <input type="text" value={data.unique_id} />  
        {/* <form method="POST" action="edit"> */}
            {/* POSTメソッドを使用してデータを送信し、editというパスに対してアクションする */}
          <input type="hidden" name="Unique_id" value="1" />
            {/* hidden 非表示 */}
            {/* <!-- <p>固有ID : <input type=".Unique_id" name=".Unique_id" value="{{.Unique_id}}" /></p>*/}
          {/* <p>動画タイトル： <input type="text" name="Movie" value="{{data.Movie}}" /></p>
          <p>URL : <input type="text" name="url" value="{{.Url}}" /></p>
          <p>歌い出し： <input type="text" name="singStart" value="{{.SingStart}}" /></p> */}
           <p>曲名：</p>
          {/*<p><textarea name="song" rows="10" cols="40">{{.Song}}</textarea></p> */}
          <p><input type="text" value=""  /> 
            <Link href="/"><input type="button" value="戻る" /></Link></p>
            {/* Linkコンポーネント：ユーザー操作より先にページを読み込ませる→画面移動せずに画面遷移できる…？→早い */}
        {/* </form> */}
    </div>
    )};

    export default EditPage;

    // 今のディレクトリじゃSSGは無理　
  // export async function getStaticProps(context) {
  //   const Unique_id = context.params.Unique_id;
  //   const res = await  fetch(`http://localhost:8080/show?Unique_id=${Unique_id}`);
  //   const posts = await res.json();
  //   console.log(posts);
  //   if (!Object.keys(posts).length) {
  //     return {
  //       notFound: true,
  //     };
  //   }
  //   return { props: { post: posts } };
  // }

  // export async function getStaticPaths() {
  //   const res = await  fetch(`http://localhost:8080/show`);
  //   const posts = await res.json();

  //   const paths = posts.map((post) => ({
  //   params: { Unique_id: post.Unique_id.toString() }, // 文字列に変換
  //    }));
  //   return { paths, fallback: true };
  //   // pathsは各unique?idに対応するパスの配列…事前にビルドするページのパス、静的生成
  //   // fallback リクエストされたパスのページが生成されてなかった場合の挙動
  //   // true 対応したページを生成→ビルド後に新しいunique_idが登録されていても対応する
  //   // fall 404
  // }

