// import React, { createContext, useState } from "react";

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({});
//   const persistedData = localStorage.getItem("persist");
//   const [persist, setPersist] = useState(
//     persistedData ? JSON.parse(persistedData) : false
//   );

//   return (
//     <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;
