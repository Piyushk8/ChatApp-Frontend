import React, { useState  ,lazy, Suspense} from 'react'
import {useNavigate} from "react-router-dom"
import { AppBar ,Badge,Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { orange } from '@mui/material/colors'
import MenuIcon from '@mui/icons-material/Menu';
import Search  from '@mui/icons-material/Search';
import Add from '@mui/icons-material/Add';
import Group from '@mui/icons-material/Group';
import {Logout, Notifications as NotificationIcon} from "@mui/icons-material"
import axios from "axios"
import toast from 'react-hot-toast';
import { server } from '../../constant/config';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducer/misc';
import { userNotExists } from '../../redux/reducer/auth'; 
import { resetNotificationCount } from '../../redux/reducer/chat';
const SearchD = lazy (()=>import ("../specific/SearchD"))
const NotificationsDialog = lazy (()=>import ("../specific/Notifications"))
const NewGroup = lazy (()=>import ("../specific/NewGroup"))
const Header = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

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
  
const LogoutHandler = ()=>{
  axios.get(`${server}/api/v1/user/logout`,{
    withCredentials:true
  })
  .then((res)=>{console.log(res)
  dispatch(userNotExists());
  toast.success(res?.data?.message)    
  })
  .catch((res)=>console.log(res))
}
 
  const {isNewGroup,isSearch , isNotification} = useSelector((state)=>state.misc)
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

  return (
    <>
     <Box sx={{flexgrow:1}} height={"4rem"} >
      <AppBar position='static' sx={{bgcolor:"#215C54"}}>
        <Toolbar>
          <Typography variant='h6' sx={{display:{xs:"none" , sm:"block"}}}>
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
        <Tooltip title="Logout">
          <IconButton color='inherit' size='large' onClick={LogoutHandler}>
            <Logout/>
          </IconButton>
        </Tooltip>
      <IconBtn
        title={"Notifications"}
        icon={<NotificationIcon/>}
        value={notificationCount}
        onClick={OpenNotificationDialog}/>
        
  
        </Toolbar>
      </AppBar>
      </Box> 
{
  isSearch && <Suspense fallback="Loading"><SearchD/></Suspense>
}
{
  isNotification && <Suspense fallback="Loading"><NotificationsDialog/></Suspense>
}
{
  isNewGroup && <Suspense fallback="Loading"><NewGroup/></Suspense>
}
    </>
  )
}


export default Header
