import { useRouter } from 'next/router';
export default function Name() {
  const router = useRouter();
  return <h1>商品{router.query.name}のページです</h1>;
}














// import Link from 'next/link';
// export default function index({ show }) {
//   return (
//     <div>
//       <h1>動画詳細</h1>
//       <ul>
//         {show.map((post) => {
//          return (
//           <div>
//             <h1>固有id : {post.unique_id}</h1>
//             <h2>動画タイトル : {post.movie} </h2>
//             <p>動画URL : {post.url}</p>
//             <p>歌い出し : {post.singStart}</p>
//             <p>曲名 : {post.song}</p>

//             {/* ↓フッターにしたい、url個別にしたい */}
//             <a href="/">戻る</a>
//             <a href={`/edit?Unique_id=${data.unique_id}`}>編集</a>
//             <a href={`?url`}>動画サイト</a>
//           </div>
//         );
//       }


// export async function getStaticProps({ params }: { params: Post[] }) {
//    // const { id } = params 
//     const id = params.post;
//     const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
//     // fetch 外部APIから非同期でデータ取得
//     const post: Post = await res.json();
//     // fetch APIを利用して取得したレスポンスデータをjson形式にパースする。
//     // 非同期的処理。Promiseを返す。
//     return { props: { post } };
//     // returnにより、データを props オブジェクトの中に格納して返している。
//     // ここで post は、取得した投稿データやその一部を指す。
//     }
   
//    // ダイナミックSSGの時に必要
//    // (動的なルートを使用する場合に、どのパスを事前に生成するかを指定する)
//    //{ params }: { params: { post: string } }
   
// export async function getStaticPaths() {
//    const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
//    const posts: Post[] = await res.json();
//    const paths = posts.map((post) => `/posts/${post.id}`);
   
//    return {
//      paths: paths || [],
//      // paths: paths || []は、pathsが存在する場合はその値を使用し、
//      // 存在しない場合は空の配列 [] を使用するという意味です。
//      fallback: false,
//    };
//    }