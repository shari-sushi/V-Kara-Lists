import { AuthProvider } from "./AuthProvider";

interface RootProviderProps {
  children: React.ReactNode;
  isSignin: boolean;
}

export const RootProvider = ({ children, isSignin }: RootProviderProps) => {
  return <AuthProvider isSignin={isSignin}>{children}</AuthProvider>;
};
