import React,{useCallback, useEffect, useMemo, useRef, useState} from 'react'
import AppLayout from '../componets/Layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material';
import { AttachFile as AttachFileIcon , Send as SendIcon } from '@mui/icons-material';
import { InputBox} from '../componets/StyledComponent';
import FileMenu from '../componets/Dialog.jsx/FileMenu';
import { SampleMessage } from '../constant/SampleData';
import MessageComponent from '../componets/shared/MessageComponent';
import { getSocket } from '../socket';
import { ALERT, IS_TYPING, NEW_MESSAGE, STOP_TYPING } from '../constant/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import {useSocketEvents} from "../hooks/hook"
import {useInfiniteScrollTop} from "6pp"
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducer/misc';
import { removeNewMessagesAlert } from '../redux/reducer/chat';
import { TypingLoader } from '../componets/Loaders/Layoutloader';
import { useNavigate } from 'react-router-dom';
//const socket= io("http://localhost:3000",{withCredentials:true ,  upgrade: false, transports: ['websocket'], reconnection: true, forceNew: false})
const Chat = ({chatId , user}) => {
  const dispatch = useDispatch();
  const nav = useNavigate("")
  const [message,setMessage] = useState("");//states
  const [messages,setMessages] = useState([])
  const [page, setPage] = useState(1)

  const [MeTyping, setMeTyping] = useState(false)
  const [Usertyping, setUsertyping] = useState(false)
  const typingtimeOut = useRef(null)
 
  const containerRef = useRef(null)
  const fileMenuRef = useRef(null)
  const bottomRef = useRef(null)

  const socket = getSocket();
 
  
  //chat queries
  const chatDetails = useChatDetailsQuery({chatId ,skip: !chatId})
  const members = chatDetails?.data?.chat?.members;
  //message history query
  const oldMessagesQuery = useGetMessagesQuery({chatId , page})
  //const oldMessages = oldMessagesQuery?.data?.message;
  const totalPages = oldMessagesQuery?.data?.totalPages

  const {data:oldMessages , setData:setOldMessages} = useInfiniteScrollTop(
    containerRef,
    oldMessagesQuery?.data?.totalPages,
    page,
    setPage,
    oldMessagesQuery?.data?.message 
  )
  
  //const allMessages = [...oldMessages?.data?.message,...messages]
  const errors = [
    {isError:oldMessages.isError , error:oldMessages.error},
    {isError:chatDetails.isError ,error:chatDetails.error}]
  
useEffect(()=>{
  dispatch(removeNewMessagesAlert(chatId))
  return()=>{
    setMessages([]);
    setMessage("");
    setOldMessages([]);
    setPage(1)
  }
},[chatId])

useEffect(()=>{
if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:"smooth"})
},[messages])

  useEffect(()=>{
    if(!chatDetails?.data?.chat) return nav("/")
  },[])

  //All Handlers
  const handleFileOpen = (e)=>{
    e.preventDefault();
    dispatch(setIsFileMenu(true))
 
  }
  const SubmitHandler = (e)=>{
    e.preventDefault();
    if(!message.trim()) return;
     //to emit message to server
    socket.emit(NEW_MESSAGE,{chatId , members ,message})
    setMessage("")
    }
 
  const MessageOnChange =(e)=>{
    e.preventDefault();
    setMessage(e.target.value);

    if(!MeTyping){
      socket.emit(IS_TYPING,{members,chatId})
      setMeTyping(true)
    }
    if(typingtimeOut) clearTimeout(typingtimeOut.current)
    typingtimeOut.current = setTimeout(() => {
      socket.emit(STOP_TYPING,{members,chatId})
      setMeTyping(false)
    }, 1500);

    }
  
  //Event listner handlers
  const isTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUsertyping(true)
   }, [chatId]);

  
  const stopTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUsertyping(false)
    
    }, [chatId]);
    

  const newMessagesListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    // Safely update messages state
    setMessages((prevMessages) => [...prevMessages, data.message]);
    }, [chatId]);
    
  const AlertListener = useCallback((content) => {
    if (data.chatId !== chatId) return;
    const messageForAlert = {
      content,
      sender:{
        _id:"csefwfkjfnksfnkwfks",
        name:"Admin"
      },
      chat:chatId ,
      createdAt:new Date().toISOString(),
    }
  }, [chatId]);
    

    const eventHandlers = {
     [ALERT] : AlertListener,
     [NEW_MESSAGE]:newMessagesListener,
     [IS_TYPING]:isTypingListener,
     [STOP_TYPING]:stopTypingListener
    }
  useSocketEvents(socket,eventHandlers)

  // useErrors(errors)

return  chatDetails.isLoading ? <Skeleton sx={{height:"50vh"}}/> : (<>
    <Stack ref={containerRef}
      boxSizing={"border-box"}
      padding={"1rem"}
      spacing={"1rem"}
      bgcolor={"white"}
      height={"90%"}
      sx={{
        overflowX:"hidden",
        overflowY:"auto"
      }}>
      {/* {messages} */}
     
      {
        oldMessages?.map((i)=>{
          return <MessageComponent key={i._id} message={i} user={user}></MessageComponent>
        })
      }
      {
        messages?.map((i)=>{
          return <MessageComponent key={i._id} message={i} user={user}></MessageComponent>
        })
      }

      {
        Usertyping && <TypingLoader/>
      }
     < div ref={bottomRef} />
       
    </Stack>
    
    <form style={{
      height:"10%"
      }}
      onSubmit={SubmitHandler}
    >
      <Stack direction={"row"} height={"90%"} padding={"1rem"}
        position={"relative"}
      >
      <IconButton position="absolute" 
        sx={{rotate:"30deg"}}
        ref={fileMenuRef} onClick={handleFileOpen}>
 
          <AttachFileIcon/>
      </IconButton>
     
      <InputBox placeholder='Send message Here...' 
        onChange={(e)=>MessageOnChange(e)}
        value={message} />
      <IconButton type='submit' sx={
        {backgroundColor:"grey",
        color:"white",
        marginLeft:"1rem",
        padding:"0.5rem",
        "&:hover":{
        bgcolor:"error.dark"
          }
        }
      } position="absolute"><SendIcon/></IconButton>
      </Stack>
    </form>

        <FileMenu anchorE1={fileMenuRef.current} chatId={chatId}></FileMenu>
    </>
  )
}

export default AppLayout()(Chat);
