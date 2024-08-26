import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./componets/auth/ProtectRoute";
import axios from "axios";
import LayoutLoader from "./componets/Loaders/Layoutloader"
import { server } from "./constant/config";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthenticated, userExists, userNotExists } from "./redux/reducer/auth";
import { Toaster } from "react-hot-toast";
import { SocketProvider} from "./socket"
import NotFound from "./pages/NotFound";
import { setPinnedChats, setPinnedChatsArray } from "./redux/reducer/chat";



const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Group2 = lazy(() => import("./pages/group2"));

const App = () => {
  
  const { user, Loader } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(()=>{
    axios.get(`${server}/api/v1/user/me`,{
      withCredentials:true
    }).then((res)=>{
      dispatch(setIsAuthenticated(true))
      dispatch(setPinnedChatsArray(res?.data?.user?.pinned))
      return dispatch(userExists(res.data.user))
    }).catch((err)=>{
      console.log(err)
      dispatch(userNotExists())})
  },[dispatch])

  return Loader ? (
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
            <Route path="/" element={<Home/>} />
            <Route path="/chats/:chatId" element={<Chat/>} />
            <Route path="/groups" element={<Group2 />} />
            <Route path="/:asd" element={<NotFound/>} />

            
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