import React, { createContext, useState, ReactNode } from "react";

interface AuthContextProps {
  auth: any; // ajustez ce type en fonction de votre objet authentification
  setAuth: (auth: any) => void; // ajustez ce type en fonction de votre objet authentification
  persist: string | null; // ajustez ce type en fonction de votre objet persist
  setPersist: (persist: string | null) => void; // ajustez ce type en fonction de votre objet persist
}

const AuthContext = createContext<AuthContextProps>({
  auth: {},
  setAuth: () => {},
  persist: null,
  setPersist: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<any>({});
  const [persist, setPersist] = useState<string | null>(
    localStorage.getItem("persist") || null
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
