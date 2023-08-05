
import { useForm } from 'react-hook-form';

export default function SimpleForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Name:
        <input {...register('name')} />
      </label>

      <input type="submit" />
    </form>
  );
}

// 入力して送信すると
// コンソールに{name: '冷凍ご飯'}と出る