import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from 'next/link';
import DeleteButton from '../components/DeleteButton';
import type { SingData } from '../types/singdata';

export default function EditForm() {
    var defaultValues:SingData = {
        unique_id:0,
        movie:"",
        url:"",
        singStart:"",
        song:"",
    }
    
    const { register, handleSubmit, formState: { errors } } = useForm<SingData>({defaultValues});
    type InputValues = SingData
    // register：フォームフィールドを登録する関数
    // handleSubmit：フォームの送信を処理する関数
    // errors：フォームフィールドのエラー情報を含むオブジェクト　　の３つを取得
    const router = useRouter();
    const { Unique_id } = router.query;

    // フォームの送信が行われたとき(他の処理が終わったとき？)に呼び出される
    const onSubmit = async (data:InputValues) => {
        // data：送信されたフォームフィールドの値を受け取るオブジェクト
        data.unique_id = Number(Unique_id)
        try {
            console.log("data=", data)
            //tryブロック　この中でエラー発生したら直後のchatchブロックが実行される
            const response = await fetch(`http://localhost:8080/edit?Unique_id=${Unique_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) //dataをJSONに変換
                });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
    
            } catch (error) {
            console.error(error);
        }
        console.log(data)
    };
 
    return (
           <form onSubmit={handleSubmit(onSubmit)}>
            登録ID: { Unique_id }
            <input defaultValue ={ Unique_id } {...register("unique_id", { required: true})} type="hidden" /><br />
            {/* <input {...register("unique_id", { required: false })} placeholder={Unique_id} type="hidden" /> */}
            <br />
            動画タイトル：
            <input {...register("movie", { required: true })} placeholder="動画" /><br />
            {errors.movie && "Movie is required"}
            {/* 条件付きレンダリング…左辺がtrueなら右辺を表示する */}
            URL:
            <input {...register("url", { required: true })} placeholder="Url" /><br />
            {errors.url && "Url is required"}
            歌いだし：
            <input {...register("singStart", { required: true })} placeholder="SingStart" /><br />
            {errors.singStart && "SingStart is required"}
            曲名：
            <input {...register("song", { required: true })} placeholder="Song" /><br />
            {errors.song && "Song is required"}
            <button type="submit" style={{ background: 'blue' }}>＜決定＞</button>

            <br />
       
        <button style={{ background: 'blue' }}><Link href={`/show?Unique_id=${ Unique_id }`} >詳細へ</Link></button>
        &nbsp;
        <button style={{ background: 'blue' }}><Link href={`/`}>一覧へ</Link></button>
    
        </form>
        // ,<DeleteButton Unique_id ={ Unique_id }/>
    );
}



