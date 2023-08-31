// 〇getStaticProps　SSR：Static Site Generation
// クライアント側でコードの内容を確認することはできない
import { SingData } from '../../types/types';


export default function EditPage({ post }: { post: SingData }) {
  console.log(111)
  return (
    <div>
      <h2>詳細情報</h2>
      <ul>
        <li>歌登録ID　　　：</li>{post.unique_id}<br />
        console.log(222)
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

  export async function getStaticProps({ params }: { params: SingData}) {
  // const { id } = params 
  const unique_id = params.unique_id;
  // paramsというオブジェクトからunique_idというプロパティを取り出し、変数idに代入
  // 分割代入という機能
  const res = await fetch(`http://localhost:8080/posts/${unique_id}`);
  // fetch 外部APIから非同期でデータ取得
  const post: SingData = await res.json();
  // fetch APIを利用して取得したレスポンスデータをjson形式にパースする。
  // 非同期的処理。Promiseを返す。
  return { props: { post } };
  // returnにより、データを props オブジェクトの中に格納して返している。
  // ここで post は、取得した投稿データやその一部を指す。
}
// ダイナミックSSGの時に必要
// (動的なルートを使用する場合に、どのパスを事前に生成するかを指定する)
//{ params }: { params: { post: string } }

export async function getStaticPaths() {
  const res = await fetch(`http://localhost:8080/`);
  const posts: SingData[] = await res.json();
  const paths = posts.map((post) => `/posts/${post.unique_id}`);
  
  return {
    paths: paths || [],
    // paths: paths || []は、pathsが存在する場合はその値を使用し、
    // 存在しない場合は空の配列 [] を使用するという意味です。
    fallback: false,
  };
}
 // postオブジェクトがプロパティを持っていない場合(空)の場合にtrueを返す。
 // Object.keys(post)はpostのキーを配列として取得し、lengthでその長さを取得。
 // 長さが0であればtrueを返す。

// 別の書き方
// const paths = posts.map((post) => ({
//   params: { post: post.id.toString() },
// }));