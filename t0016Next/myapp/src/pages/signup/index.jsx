import { useForm } from "react-hook-form";

const SignUp = () => {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Something went wrong");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Username:
        <input name="username" ref={register({ required: true })} />
        {errors.username && <p>This field is required</p>}
      </label>

      <label>
        Password:
        <input name="password" type="password" ref={register({ required: true })} />
        {errors.password && <p>This field is required</p>}
      </label>

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
