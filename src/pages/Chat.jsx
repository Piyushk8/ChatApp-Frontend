import React,{useCallback, useEffect, useMemo, useRef, useState} from 'react'
import AppLayout from '../componets/Layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material';
import { AttachFile as AttachFileIcon , Send as SendIcon } from '@mui/icons-material';
import { InputBox} from '../componets/StyledComponent';
import FileMenu from '../componets/Dialog.jsx/FileMenu';
import { SampleMessage } from '../constant/SampleData';
import MessageComponent from '../componets/shared/MessageComponent';
import { getSocket } from '../socket';
import { NEW_MESSAGE } from '../constant/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import {useSocketEvents} from "../hooks/hook"
import {useInfiniteScrollTop} from "6pp"
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducer/misc';
//const socket= io("http://localhost:3000",{withCredentials:true ,  upgrade: false, transports: ['websocket'], reconnection: true, forceNew: false})
const Chat = ({chatId , user}) => {
  const dispatch = useDispatch();

  const [message,setMessage] = useState("");//states
  const [messages,setMessages] = useState([])
  const [page, setPage] = useState(1)
 
  const containerRef = useRef(null)
  const fileMenuRef = useRef(null)
  
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
    }
  
  //Event listner handlers
  const newMessagesListener = useCallback((data) => {
    console.log(data, "data");
    if (data.chatId !== chatId) return;
    // Safely update messages state
    setMessages((prevMessages) => [...prevMessages, data.message]);
    }, [chatId]);
  

  const EventHandler = useMemo(() => ({ [NEW_MESSAGE]: newMessagesListener }), [newMessagesListener]);

  useSocketEvents(socket,EventHandler)

  // useErrors(errors)

return  chatDetails.isLoading ? <Skeleton sx={{height:"50vh"}}/> : (<>
    <Stack ref={containerRef}
      boxSizing={"border-box"}
      padding={"1rem"}
      spacing={"1rem"}
      bgcolor={"gray"}
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
