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
export async function getServerSideProps({ params }) {
  const id = params.post;
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = await res.json();
  console.log(post);
  if (!Object.keys(post).length) {
    return {
      notFound: true,
    };
  }
  return { props: { post } };
}