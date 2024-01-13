import React from "react";

import { Layout } from '@/components/layout/Layout'
import { SigninForm } from "@/components/form/User";

export function SigninPage() {

  return (

    <Layout pageName={"ログイン"} isSignin={false}>
      <div className="flex justify-center w-full mt-6">
        <div className="w-full max-w-xs">
          <SigninForm />
        </div>
      </div>
    </Layout >
  );
}

export default SigninPage;

