const ExampleComponent = () => {
    const { data: session } = useSession();
    return (
      <div>
        { session && (
          <p>ログイン認証ok</p>
        )}
      </div>
    );