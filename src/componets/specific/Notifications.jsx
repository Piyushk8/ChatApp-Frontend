import { Dialog, DialogTitle, Stack, Typography,ListItem,Avatar, Button, Box } from '@mui/material'
import React,{memo, useEffect, useState} from 'react'
import { SampleData, SampleNotifications } from '../../constant/SampleData'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api.js";
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotification } from '../../redux/reducer/misc.js';
import {toast} from "react-hot-toast"
import NotifyImage from "../../assets/NotifyImage.webp"
import AvatarCard from '../shared/AvatarCard.jsx';

const NotificationsDialog = () => {
  const dispatch = useDispatch();
  //states
  const {isNotification}  = useSelector((state)=>state.misc)
  
  //RTK api calls 
  const {data , isloading} = useGetNotificationsQuery();
  const [AcceptRequest] = useAcceptFriendRequestMutation();
  //all handler functions
  const FriendRequestHandler= async({_id,accept})=>{
    dispatch(setIsNotification(false))
    try {
      const res = await AcceptRequest({RequestId:_id ,accept})
      
      if(res?.data?.success){
        
        toast.success(res?.data?.message)
      }else{
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const closeHandler = ()=>{ dispatch(setIsNotification(false))}
 
 
  return (
    <Dialog open={isNotification}  onClose={closeHandler}>
      <Stack p={{xs:"1rem" , sm:"2rem"}} 
      direction={"column"}
      alignItems={"center"}
      maxWidth={"25rem"} sx={{Height:"50vh"}}>
      <DialogTitle
        sx={{textAlign:"center",fontFamily:"belleza",fontWeight:"600"}}
      >
        Notifications
      </DialogTitle>
          <Stack sx={{height:"100%"}}>
          {
            data?.requests.length > 0 ? (
            
              data?.requests?.map((i,index)=>{
              return <NotificationItem sender={i.sender} _id={i._id} handler={FriendRequestHandler}/>
            })
            ) 
            
            :
            
            (<Box sx={{
              height:"30vh",
              width:"50vh",
              backgroundPosition:"center",
              backgroundRepeat:"no-repeat",
              backgroundSize:"cover",
              backgroundImage:`url(${NotifyImage})`}}>
              <Typography sx={{color:'grey',textAlign:"center"}}>No New Notifications</Typography>
            </Box>)
          } 
          </Stack>
      </Stack>


    </Dialog>
   
  )
}
const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name,avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        overflow={"auto"}
      >
        <Avatar src={avatar?.url}/>

        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} `}
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default NotificationsDialog
