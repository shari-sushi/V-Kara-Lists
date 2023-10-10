import React from 'react';
import { useRouter } from 'next/router';

const DeleteButton = ({ Unique_id }) => {
  const router = useRouter();
  const deleteItem = async () => {
    try {
      // const response = await fetch(`http://localhost:8080/delete?Unique_id=${ Unique_id }`, {
      const response = await fetch(`http://localhost:8080/delete?Unique_id=${ Unique_id }`, {

        method: 'DELETE',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
      });
      console.log("delete処理は渡した")
      if (!response.ok) { //「HTTPｽﾃｰﾀｽｺｰﾄﾞが200番台の時にtru」の!
        throw new Error(response.statusText);
        //HTTPレスポンスのｽﾃｰﾀｽに応じてテキストを返す。404ならNot Founde
      }

      router.push(`/`)

      // レスポンスを処理し、必要に応じてUIを更新します。
      // 例えば、親コンポーネントから渡された更新関数を呼び出すことができます。

    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={deleteItem}>削除</button>;
};

export default DeleteButton;
