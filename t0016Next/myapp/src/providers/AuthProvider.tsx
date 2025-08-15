import React, { createContext, useContext } from "react";

interface AuthContextType {
  isSignin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  isSignin: boolean;
}

export const AuthProvider = ({ children, isSignin }: AuthProviderProps) => {
  return <AuthContext.Provider value={{ isSignin }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
