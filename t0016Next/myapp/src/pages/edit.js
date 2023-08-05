import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from 'next/link';

export default function EditForm() {
    const { register="", handleSubmit, formState: { errors } } = useForm();
    // register：フォームフィールドを登録する関数
    // handleSubmit：フォームの送信を処理する関数
    // errors：フォームフィールドのエラー情報を含むオブジェクト　　の３つを取得
    const router = useRouter();
    const { Unique_id } = router.query;

    // フォームの送信が行われたとき(他の処理が終わったとき？)に呼び出される
    const onSubmit = async (data) => {
        // data：送信されたフォームフィールドの値を含むオブジェクト
        // const unique_id = router.query.id;
        try {
            //tryブロック　この中でエラー発生したら直後のchatchブロックが実行される
            const response = await fetch(`/edit?Unique_id=${Unique_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            // router.push(`/edit`) ←更新されなかった
            // router.push(`/show?Unique_id=${Unique_id}`)
            
        } catch (error) {
            console.error(error);
        }
        console.log(data)
        // →　{Movie: '4', Url: '4', SingStart: '4', Song: '4'}
    };

    return (
           <form onSubmit={handleSubmit(onSubmit)}>
            登録ID: { Unique_id }
            <input {...register("Unique_id", { required: true })} placeholder="Unique_id" type="hidden" value= { Unique_id }  /><br />
                       
            動画タイトル：
            <input {...register("Movie", { required: true })} placeholder="動画" /><br />
            {errors.Movie && "Movie is required"}
            URL:
            <input {...register("Url", { required: true })} placeholder="Url" /><br />
            {errors.Url && "Url is required"}
            歌いだし：
            <input {...register("SingStart", { required: true })} placeholder="SingStart" /><br />
            {errors.SingStart && "SingStart is required"}
            曲名：
            <input {...register("Song", { required: true })} placeholder="Song" /><br />
            {errors.Song && "Song is required"}
            <button type="submit" style={{ background: 'blue' }}>＜決定＞</button>

            <br />
        <button style={{ background: 'blue' }}><Link href={`/show?Unique_id=${ Unique_id }`} >詳細へ</Link></button>
        &nbsp;
        <button style={{ background: 'blue' }}><Link href={`/`}>一覧へ</Link></button>
        
        </form>
    );
}

