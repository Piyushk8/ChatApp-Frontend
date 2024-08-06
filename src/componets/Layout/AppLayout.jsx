import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from './Header'
import Title from "../shared/Title"
import {Drawer, Grid, Skeleton} from "@mui/material"
import ChatList from '../specific/ChatList';
import { useNavigate, useParams } from 'react-router-dom';
import Profile from '../specific/Profile';
import { useMyChatsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducer/misc';
import { getSocket } from '../../socket';
import { CHAT_JOINED,CHAT_LEFT,NEW_MESSAGE, NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USER,REFETECH_CHATS } from '../../constant/events';
import { useSocketEvents } from '../../hooks/hook';
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducer/chat';
import { getOrSaveFromStorage } from '../../lib/features';
import DeleteChatMenu from '../Dialog.jsx/deleteChatMenu';



const AppLayout = () => (WrappedComponent) => {
  return (props) =>{
    const nav = useNavigate();
    const socket = getSocket();
    const dispatch = useDispatch()
    const params = useParams();
    const chatId = params.chatId;
    const deleteOptionAnchor = useRef(null);

      //to fetch chats using RTK QUERY
    const {isLoading , data,isError ,error, refetch} = useMyChatsQuery("")
    const {isMobile } = useSelector((state)=>state.misc)
    const {user} = useSelector((state)=>state.auth)
    const {newMessagesAlert} = useSelector((state)=>state.chat)
    const [onlineUsers, setonlineUsers] = useState([])
    
    // console.log(data) to check for chats incoming
    //All Handlers 
    const handleDeleteChat = (e ,_id , groupChat)=>{
      e.preventDefault()
      deleteOptionAnchor.current = e.currentTarget;
      console.log(deleteOptionAnchor.current)
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
      console.log("refetch")
      refetch()
    },[refetch]) 

    const onlineUsersHandler = useCallback((data)=>{
     setonlineUsers(data)
    },[refetch])
    
    const eventHandlers = {[NEW_MESSAGE_ALERT]:newMessageAlertHandler,
      [NEW_MESSAGE]:newMessagesHandler,
      [NEW_REQUEST]:newRequestHandler,
      [REFETECH_CHATS]:refetchChatHandler,
      [ONLINE_USER]:onlineUsersHandler
    
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

        {
          isLoading ?
          <Skeleton/> 
                  : 
          <Drawer onClose={handleMobileClose}
            open={isMobile}>
             <ChatList 
             w="70vw"
             chats={data?.transformedChats} chatId={chatId} 
            newMessagesAlert={newMessagesAlert}
            onlineUsers={onlineUsers}
            //onlineUsers={['66abe2726bf758fce1c6ae13', '66a8baa24f2fdd6a8bfa815e']}
            handleDeleteChat={handleDeleteChat}
            />
          </Drawer>
        }
        <Grid container  sx={{
          height: 'calc(100vh - 5rem)',
          overflow: 'hidden',
        }}> 

          <Grid item sm={4} md={3}  sx={{display:{xs:"none" , sm:"block"}}}  height={"100%"} >
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
          <Grid item xs={12} sm={8}  md={5} bgcolor="#F0F0F0"  lg={6} height={"100%"} >
          <WrappedComponent {...props} user={user}  chatId={chatId} />
          </Grid>
        
          <Grid item md={4} lg={3}
           sx={{display:{xs:"none",md:"block"} , 
           padding:"2rem"}}
            bgcolor="#009688" height={"100%"} ><Profile user={user}/> </Grid>
        </Grid>

        
            
        </>
    );
  };
};

export default AppLayout;