import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./componets/auth/ProtectRoute";
import axios from "axios";
import LayoutLoader from "./componets/Loaders/Layoutloader"
import { server } from "./constant/config";
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducer/auth";
import { Toaster } from "react-hot-toast";
import {getSocket , SocketProvider} from "./socket"


const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Group"));


const App = () => {
  
  const { user, loader } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) =>{ console.log('profile fetch') ; 
        return dispatch(userExists(data.user))})
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);

  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
      <Routes>
      
          <Route
            element={
              <SocketProvider>
                <ProtectRoute user={user} />
                </SocketProvider>
            }
          >
            <Route path="/chats/:chatId" element={<Chat/>} />
            <Route path="/" element={<Home/>} />
            <Route path="/groups" element={<Groups />} />
            
          </Route>

          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
            />

          
        </Routes>
      </Suspense>

      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export default App;