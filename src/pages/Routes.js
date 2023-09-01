// import React from 'react'
// import { Navigate, Route, Routes } from 'react-router-dom'

// import Frontend from "./Frontend"
// import Auth from "./Auth"
// import Dashboard from "./Dashboard"
// import { useAuthContext } from 'contexts/AuthContext'
// import PrivateRoute from 'components/PrivateRoute'

// export default function Index() {
//   const { isAuth } = useAuthContext()
//   return (
//     <>
//       <Routes>
//         <Route path='/*' element={<PrivateRoute Component={Frontend} />} />
//         <Route path='/auth/*' element={!isAuth ? <Auth /> : <Navigate to="/" />} />
//         <Route path='/dashboard/*' element={<PrivateRoute Component={Dashboard} />} />
//       </Routes>
//     </>
//   )
// }
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Dashboard1 from "./Dashboard1";
import Auth from "./Auth";
import PrivateRoute from "../components/PrivateRoute";
import { useAuthContext } from "../contexts/AuthContext";
export default function Index() {
  const { isAuth } = useAuthContext();

  return (
    <>
      <Routes>
        <Route path="/*" element={<PrivateRoute Component={Dashboard1} />} />
        <Route
          path="/auth/*"
          element={!isAuth ? <Auth /> : <Navigate to="/" />}
        />
        <Route path="*" element={<h1>ERROR 404!</h1>} />
      </Routes>
      <ToastContainer />
    </>
  );
}
