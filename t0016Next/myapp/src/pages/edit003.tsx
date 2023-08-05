import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import type { SingData } from '../types/types'; //type{}で型情報のみインポート 今回は実は不要多分

// export interface SingDataI {
//   unique_id : number;
//   movie : string;
//   url      : string;
//   singStart : string;
//   song     : string;
// };

function EditPage() {
   const router = useRouter();
  const { Unique_id } = router.query;

  // if (!SingData) {
  //   return <div>Loading...</div>;
  // }
  const { register, handleSubmit } = useForm<SingData>();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`http://localhost:8080/edit`, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          Unique_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Something went wrong");
      // Redirect or handle response accordingly
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Movie:
        <input name="Movie" ref={register({ required: true })} />
      </label>

      <label>
        Url:
        <input name="url" ref={register({ required: true })} />
      </label>

      <label>
        SingStart:
        <input name="singStart" ref={register({ required: true })} />
      </label>

      <label>
        Song:
        <input name="song" ref={register({ required: true })} />
      </label>

      <button type="submit">Update</button>
    </form>
  );
}

export default EditPage;