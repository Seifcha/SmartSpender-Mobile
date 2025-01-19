// import React, { useState, useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import CircularProgress from "@mui/material/CircularProgress";
// import useRefreshToken from "../hooks/useRefreshToken";
// import useAuth from "../hooks/useAuth";

// const PersistLogin: React.FC = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const refresh = useRefreshToken();
//   const { auth, persist } = useAuth();

//   useEffect(() => {
//     let isMounted = true;

//     const verifyRefreshToken = async () => {
//       try {
//         await refresh();
//       } catch (err) {
//         console.error(err);
//       } finally {
//         isMounted && setIsLoading(false);
//       }
//     };

//     if (!auth?.accessToken && persist) {
//       verifyRefreshToken();
//     } else {
//       setIsLoading(false);
//     }

//     return () => {
//       isMounted = false;
//     };
//   }, [auth?.accessToken, persist, refresh]);

//   useEffect(() => {
//     console.log(`isLoading: ${isLoading}`);
//   }, [isLoading]);

//   return (
//     <>
//       {!persist ? (
//         <Outlet />
//       ) : isLoading ? (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: "100vh",
//           }}
//         >
//           <CircularProgress />
//           <br />
//           <p>Cela prendra quelques instants...</p>
//         </div>
//       ) : (
//         <Outlet />
//       )}
//     </>
//   );
// };

// export default PersistLogin;
