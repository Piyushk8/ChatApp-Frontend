import React, { lazy, Suspense, useEffect, useRef} from 'react'
import {useNavigate} from "react-router-dom"
import { AppBar ,Avatar,Badge,Box, CircularProgress, IconButton, Toolbar, Tooltip, Typography, useMediaQuery } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import Search  from '@mui/icons-material/Search';
import Add from '@mui/icons-material/Add';
import Group from '@mui/icons-material/Group';
import { Notifications as NotificationIcon} from "@mui/icons-material"
import axios from "axios"
import toast from 'react-hot-toast';
import { server } from '../../constant/config';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile,setIsProfile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducer/misc';
import { userNotExists } from '../../redux/reducer/auth'; 
import { resetNotificationCount } from '../../redux/reducer/chat';
import { getOrSaveFromStorage } from '../../lib/features';
import { NEW_REQUEST } from '../../constant/events';
import  UserAvatar from "../../assets/userAvatar.webp"
//import { useGetNotificationsQuery } from '../../redux/api/api';
const ProfileMenu = lazy(()=>import('../Dialog.jsx/ProfileMenu'));
const SearchD = lazy (()=>import ("../specific/SearchD"))
const NotificationsDialog = lazy (()=>import ("../specific/Notifications"))
const NewGroup = lazy (()=>import ("../specific/NewGroup"))


const Header = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const profileAnchor = useRef(null)

  //all Handler function
  const handleMobile= ()=>{
    dispatch(setIsMobile(true))    
  }
  const OpenSearchDialogue= ()=>{
    dispatch(setIsSearch(true))
  }
  const OpenNewGroup= ()=>{
    dispatch(setIsNewGroup(true))
  }
  const navitageToGroup= ()=>{
    nav("/groups")
  }
  const OpenNotificationDialog = ()=>{
    dispatch(setIsNotification(true))
    dispatch(resetNotificationCount())
  }
  const OpenProfileDialog =(e)=>{
    e.preventDefault()
    dispatch(setIsProfile(true))
  }
 
  
const LogoutHandler = ()=>{
  axios.get(`${server}/api/v1/user/logout`,{
    withCredentials:true
  })
  .then((res)=>{
  dispatch(userNotExists());
  toast.success(res?.data?.message)    
  })
  .catch((res)=>toast.error(res?.data?.err?.message))
}
 
  const {isNewGroup,isSearch , isNotification,isProfile} = useSelector((state)=>state.misc)
  const {notificationCount} = useSelector((state)=>state.chat)

  
  
  const IconBtn = ({title , icon , onClick ,value})=>{

    return(
      <Tooltip title={title}>
      <IconButton color='inherit' size='large' onClick={onClick}>
        {
          value ? <Badge badgeContent={value}>{icon}</Badge> : icon
        }
      </IconButton>
    </Tooltip>
    )
  }

  useEffect(()=>{
    getOrSaveFromStorage({key:NEW_REQUEST,value:notificationCount})
  },[notificationCount])
//!only online users can get friend request for now
  
return (
    <>
     <Box sx={{flexgrow:1}} height={"4rem"} >
      <AppBar position='static' sx={{bgcolor:"#215C54"}} >
        <Toolbar>
          <Typography
            onClick={()=>{nav('/')}}
            variant='h6' sx={{display:{xs:"none" , sm:"block"}}}>
            Chat App
          </Typography>

        <Box sx={{display:{xs:"block", sm:"none"}}}>
          <IconButton color='inherit' onClick={handleMobile}><MenuIcon/></IconButton>
        </Box>
        <Box sx={{
              flexGrow:1
            }}>
        </Box>
        <Tooltip title="Search">
          <IconButton color='inherit' size='large' onClick={OpenSearchDialogue}>
            <Search></Search>
          </IconButton>
        </Tooltip>
        <Tooltip title="NewGroup">
          <IconButton color='inherit' size='large' onClick={OpenNewGroup}>
            <Add></Add>
          </IconButton>
        </Tooltip>
        <Tooltip title="ManageGroup">
          <IconButton color='inherit' size='large' onClick={navitageToGroup}>
            <Group></Group>
          </IconButton>
        </Tooltip>
      <IconBtn
        title={"Notifications"}
        icon={<NotificationIcon/>}
        value={notificationCount?.Count}
        onClick={OpenNotificationDialog}/>
        
        {/* <Tooltip title="Logout">
          <IconButton color='inherit' size='large' onClick={LogoutHandler}>
            <Logout/>
          </IconButton>
        </Tooltip> */}
        <IconButton 
          ref={profileAnchor.current}
          onClick={OpenProfileDialog}>
        <Avatar src={UserAvatar}>
        </Avatar>
        </IconButton>

        </Toolbar>
      </AppBar>
      </Box> 
{
  isSearch && <Suspense fallback=""><SearchD/></Suspense>
}
{
  isNotification && <Suspense fallback=""><NotificationsDialog/></Suspense>
}
{
  isNewGroup && <Suspense fallback={<CircularProgress sx={{alignContent:"center"}}/>}><NewGroup/></Suspense>
}
{
  isProfile && <Suspense > <ProfileMenu 
                              profileAnchor={profileAnchor}
                              isProfile={isProfile}
                              dispatch={dispatch}
                             LogoutHandler={LogoutHandler} /></Suspense>
}

    </>
  )
}


export default Header
