import { Dialog, DialogTitle, Stack, Typography,ListItem,Avatar, Button, Box, DialogContent, IconButton, Tooltip } from '@mui/material'
import React,{memo, useEffect, useState} from 'react'
import { SampleData, SampleNotifications } from '../../constant/SampleData'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api.js";
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotification } from '../../redux/reducer/misc.js';
import {toast} from "react-hot-toast"
import NotifyImage from "../../assets/NotifyImage.webp"
import AvatarCard from '../shared/AvatarCard.jsx';
import { Check, CheckBoxRounded, CheckBoxSharp, ClearSharp } from '@mui/icons-material';

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
    <Dialog open={isNotification}  onClose={closeHandler}
    sx={{}}
    fullWidth
    maxWidth={"xs"}
    >
      
        
        <DialogTitle
        sx={{textAlign:"center",
          fontFamily:"belleza",
          fontWeight:"600",
          width:'100%',
          color:""
        }}
        >
        Notifications
        </DialogTitle>

        <DialogContent sx={{width:"100%"}}>
        <Stack maxHeight={"45vh"} sx={{overflowY:"auto"}}>
          {
            data?.requests.length > 0 ? 
            (data?.requests?.map((i,index)=>{
              return <NotificationItem 
                sender={i.sender} 
                _id={i._id} 
                handler={FriendRequestHandler}/>
            })
     ) 
    
     :
    
     (<Box sx={{
        height:"40vh",
        maxHeight:'45vh',
        overflowY:'auto',
       width:"100%",
       backgroundPosition:"center",
       backgroundRepeat:"no-repeat",
       backgroundSize:"cover",
       backgroundImage:`url(${NotifyImage})`}}>
       <Typography sx={{color:'grey',textAlign:"center"}}>No New Notifications</Typography>
     </Box>)
   } 
   </Stack>
        </DialogContent>
    </Dialog>
   
  )
}

const NotificationItem = memo(({ sender, _id, handler}) => {
  const { name,avatar } = sender;
  return (
    <ListItem key={_id}>
      <Stack 
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        overflow={"auto"}
      >
        <Avatar src={avatar?.url}/>
        <Tooltip title={`${name}`}>
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
        </Tooltip>

        <Stack
          direction={{
            sm: "row",
          }}
          spacing={"0.5rem"}
        >
          <Button sx={{fontSize:"0.8rem",display:{xs:"none",sm:"block"},width:"1rem"}} onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button sx={{fontSize:"0.8rem",display:{xs:"none",sm:"block" ,width:"1rem"}}} color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>

        <Stack direction={"row"}>
        <IconButton onClick={() => handler({ _id, accept: true })} 
            sx={{color:"green", display:{sm:"none"}}}>
          <CheckBoxSharp  />
        </IconButton >
          <IconButton onClick={() => handler({ _id, accept: false })} 
            sx={{color:"red", 
            display:{sm:"none"}}}>
          <ClearSharp/>
          </IconButton>

        </Stack>
      </Stack>
    </ListItem>
  );
});

export default NotificationsDialog
