import React,{useRef} from 'react'
import AppLayout from '../componets/Layout/AppLayout'
import { IconButton, Stack } from '@mui/material';
import { AttachFile as AttachFileIcon , Send as SendIcon } from '@mui/icons-material';
import { InputBox} from '../componets/StyledComponent';
import FileMenu from '../componets/Dialog.jsx/FileMenu';
import { SampleMessage } from '../constant/SampleData';
import MessageComponent from '../componets/shared/MessageComponent';

const user = {
  "_id":"asasdad",
  "name":"Piyush"
}
const Chat = () => {
  const containerRef = useRef(null)
  const fileMenuRef = useRef(null)
  
  return (<>
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
    }}>
      <Stack direction={"row"} height={"90%"} padding={"1rem"}
        position={"relative"}
      >
      <IconButton position="absolute" 
      sx={{rotate:"30deg"}}
      ref={fileMenuRef}>
        <AttachFileIcon/>
      </IconButton>
     
      <InputBox placeholder='Send message Here...'/>
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
