import React, { lazy, useCallback, useEffect, useRef, useState } from 'react'
import Header from './Header'
import Title from "../shared/Title"
import {Box, Drawer, Grid, Skeleton} from "@mui/material"
import ChatList from '../specific/ChatList';
import { useNavigate, useParams } from 'react-router-dom';
import Profile from '../specific/Profile';
import { useMyChatsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setChatIdContextMenu, setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducer/misc';
import { getSocket } from '../../socket';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, NEW_REQUEST,REFETECH_CHATS, USER_STATUS_CHANGE } from '../../constant/events';
import { useSocketEvents } from '../../hooks/hook';
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducer/chat';
import { getOrSaveFromStorage } from '../../lib/features';
const DeleteChatMenu = lazy(()=>import('../Dialog.jsx/deleteChatMenu')) 



const AppLayout = () => (WrappedComponent) => {
  return (props) =>{
    const nav = useNavigate();
    const {socket} = getSocket();
    const dispatch = useDispatch()
    const params = useParams();
    const chatId = params.chatId;
    const deleteOptionAnchor = useRef(null);
    let ChatIdContextMenu;
      //to fetch chats using RTK QUERY
    const {isLoading , data,isError ,error, refetch} = useMyChatsQuery("")
    const {isMobile } = useSelector((state)=>state.misc)
    const {user} = useSelector((state)=>state.auth)
    const {newMessagesAlert} = useSelector((state)=>state.chat)
    const [onlineUsers, setonlineUsers] = useState([])
    
    //All Handlers 
    const handleDeleteChat = (e ,_id , groupChat)=>{
      e.preventDefault()
      deleteOptionAnchor.current = e.currentTarget;
     dispatch(setChatIdContextMenu(_id))
      dispatch(setIsDeleteMenu(true))
      dispatch(setSelectedDeleteChat({chatId,_id,groupChat}))
    };
    
    const handleMobileClose=()=>{
      dispatch(setIsMobile(false))
    }

    //These Are event listen Handler
    const newRequestHandler = useCallback(()=>{
      dispatch(incrementNotification())
    },[dispatch])
    
    const newMessageAlertHandler = useCallback((data)=>{
      if (chatId === data.chatId) return;
        dispatch(setNewMessagesAlert(data))
    },[chatId])

    const newMessagesHandler = useCallback(()=>{
      refetch()
    },[refetch])

    const refetchChatHandler = useCallback(()=>{
      refetch()
    },[refetch]) 

    const userStatusChangeHandler = useCallback(({ userId, status }) => {

      if (userId) {
          if (status === "online") {
              setonlineUsers((prev) => {
                  // Only add userId if it's not already in the array to avoid duplicates
                  if (!prev?.includes(userId)) {
                      return [...prev, userId];
                  }
                  return prev;
              });
          }
          if (status === "offline") {
              setonlineUsers((prev) => {
                  // Filter out the userId from the array
                  return prev.filter((i) => i !== userId);
              });
          }
      }
       }, [refetch]);
  
    const myOnlineFriendsListener = useCallback(({onlineMemberIds})=>{
      setonlineUsers(onlineMemberIds[0]?.onlineMembers)
    },[refetch])
    
    const eventHandlers = {[NEW_MESSAGE_ALERT]:newMessageAlertHandler,
      [NEW_MESSAGE]:newMessagesHandler,
      [NEW_REQUEST]:newRequestHandler,
      [REFETECH_CHATS]:refetchChatHandler,
      [USER_STATUS_CHANGE]:userStatusChangeHandler,
      "myOnlineFriends":myOnlineFriendsListener
    
    }
    useSocketEvents(socket,eventHandlers)
    //All Items to Load on Page Load
    useEffect(()=>{
      getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert})      
    },[newMessagesAlert])

  return (
        <>
        <Title title='Chat App ' description='Hey!'></Title>
        <Header></Header>

        <DeleteChatMenu  dispatch={dispatch} deleteOptionAnchor={deleteOptionAnchor}/>
{/* this is chat list drawer for small screens */}
        {
          isLoading ?
          <Skeleton/> 
                  : 
          <Drawer onClose={handleMobileClose}
            open={isMobile}
            >
             <ChatList 
             w="65vw"
             chats={data?.transformedChats} chatId={chatId} 
            newMessagesAlert={newMessagesAlert}
            onlineUsers={onlineUsers}
            handleDeleteChat={handleDeleteChat}
            />
          </Drawer>
        }
      {/* main grid */}
      <Box 
        sx={{
           background: 'linear-gradient(45deg, #fdfbfb 0%, #ebedee 100%)',
          height:"calc(100vh - 5rem)",
          //backgroundImage: 'url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)',  // Replace with your image URL
          backgroundSize: 'cover',    
          backgroundPosition: 'center',  
          backgroundRepeat: 'no-repeat',  
        }}
      >
        <Box bgcolor={"red"}> </Box>
        <Grid container  sx={{
          bgcolor:'',
          marginLeft:{lg:'2rem'},
          height: 'calc(100vh - 4rem)',
          width:{lg:"95%"},
          
          overflow: 'hidden',
        }}> 

          <Grid item sm={4} md={4}  sx={{display:{xs:"none" , sm:"block"}}}  height={"100%"} >
           {
            isLoading ? <Skeleton></Skeleton> : 
            <ChatList 
              chats={data?.transformedChats} 
              chatId={chatId} 
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
              handleDeleteChat={handleDeleteChat}
            />
           }

               {/* </ChatList> */}
          </Grid>
        {/* {mainBody} */}
          <Grid item xs={12} sm={8} md={8}  bgcolor="#F0F0F0"  height={"100%"} >
          <WrappedComponent {...props} user={user}  chatId={chatId} />
          </Grid>
        
        </Grid>
        </Box>
        
            
        </>
    );
  };
};

export default AppLayout;