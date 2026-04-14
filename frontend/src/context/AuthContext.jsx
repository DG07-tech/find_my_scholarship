import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuthState } from "../lib/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => getAuthState());

  const updateUserState = () => {
    setAuthState(getAuthState());
  };

  useEffect(() => {
    updateUserState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        role: authState.role,
        token: authState.token,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
