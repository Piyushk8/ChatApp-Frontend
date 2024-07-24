import React from 'react'
import Header from './Header'
import Title from "../shared/Title"
import {Drawer, Grid, Skeleton} from "@mui/material"
import { green, red, yellow } from '@mui/material/colors';
import ChatList from '../specific/ChatList';
import {SampleData} from "../../constant/SampleData"
import { useParams } from 'react-router-dom';
import Profile from '../specific/Profile';
import { useMyChatsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile } from '../../redux/reducer/misc';
import { getSocket } from '../../socket';


const AppLayout = () => (WrappedComponent) => {
  return (props) =>{
    const socket = getSocket();
    console.log(socket.id)

    const dispatch = useDispatch()
    const params = useParams();
    const chatId = params.chatId;
      //to fetch chats using RTK QUERY
    const {isLoading , data,isError ,error, refetch} = useMyChatsQuery("")
    const {isMobile } = useSelector((state)=>state.misc)
    const {user} = useSelector((state)=>state.auth)
    // console.log(data) to check for chats incoming

    const handleDeleteChat = (e ,_id , groupChat)=>{
      e.preventDefault();
      console.log("deletd chat" , _id);
    };
    
    const handleMobileClose=()=>{
      dispatch(setIsMobile(false))
      

    }


  return (
        <>
        <Title title='Chat App ' description='Hey!'></Title>
        <Header></Header>

        {
          isLoading?<Skeleton/>: <Drawer onClose={handleMobileClose}
            open={isMobile}>
             <ChatList 
             w="70vw"
             chats={data?.transformedChats} chatId={chatId} 
            newMessagesAlert={[{chatId:chatId,count:4}]}
            onlineUsers={["1","2"]}
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
            <ChatList chats={data?.transformedChats} chatId={chatId} 
            newMessagesAlert={[{chatId:chatId,count:4}]}
            onlineUsers={["1","2"]}
            handleDeleteChat={handleDeleteChat}
            />
           }

               {/* </ChatList> */}
          </Grid>
        
          <Grid item xs={12} sm={8}  md={5} bgcolor="#F0F0F0"  lg={6} height={"100%"} >
          <WrappedComponent {...props} />
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