import React,{useEffect, useRef, useState} from 'react'
import AppLayout from '../componets/Layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material';
import { AttachFile as AttachFileIcon , Send as SendIcon } from '@mui/icons-material';
import { InputBox} from '../componets/StyledComponent';
import FileMenu from '../componets/Dialog.jsx/FileMenu';
import { SampleMessage } from '../constant/SampleData';
import MessageComponent from '../componets/shared/MessageComponent';
import { getSocket } from '../socket';
import { NEW_MESSAGE } from '../constant/events';
import { useChatDetailsQuery } from '../redux/api/api';

const user = {
  "_id":"asasdad",
  "name":"Piyush"
}
const Chat = ({chatId }) => {
  const containerRef = useRef(null)
  const fileMenuRef = useRef(null)
  
  const socket = getSocket();
  const chatDetails = useChatDetailsQuery({chatId ,skip: !chatId})
  const members = chatDetails?.data?.chat?.members;
   

  const [message,setMessage] = useState("")
  const SubmitHandler = (e)=>{
    e.preventDefault();
    if(!message.trim()) return;
    // console.log(message)
    //to emit message to server
    socket.emit(NEW_MESSAGE,{chatId , members ,message} )
    setMessage("")
    
  }

  useEffect(()=>{
    socket.on("NEW_MESSAGE" , (data)=>{
      console.log(data);
    })


    return ()=>{
      socket.remo
    }
  },[])


  return  chatDetails.isLoading?<Skeleton sx={{height:"50vh"}}/> : (<>
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
        SampleMessage.map((i)=>{
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
      ref={fileMenuRef}>
        <AttachFileIcon/>
      </IconButton>
     
      <InputBox placeholder='Send message Here...' 
        onChange={(e)=>setMessage(e.target.value)}
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

        <FileMenu anchorE1={fileMenuRef.current}></FileMenu>
    </>
  )
}

export default AppLayout()(Chat);
