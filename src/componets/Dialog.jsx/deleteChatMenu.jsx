import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducer/misc'
import { Delete, ExitToApp } from '@mui/icons-material'
import { useAsyncMutation } from '../../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'
import { useNavigate } from 'react-router-dom'

const DeleteChatMenu = ({dispatch , deleteOptionAnchor}) => {
    const {isDeleteMenu,selectedDeleteChat} = useSelector((state)=>state.misc)
    const nav = useNavigate()
    const [deleteChat,_,deleteChatData] = useAsyncMutation(useDeleteChatMutation)
    const [leaveGroup,__,LeaveGroupData] = useAsyncMutation(useLeaveGroupMutation)
    
    const closeHandler = ()=>{
        dispatch(setIsDeleteMenu(false))
        deleteOptionAnchor.current=null
    }
    

    const LeaveGroup = ()=>{
        closeHandler();
        leaveGroup("Group Left",{id:selectedDeleteChat._id})
        
        
    }
    const Unfriend = ()=>{
        
        closeHandler();
        deleteChat("Removed",{id:selectedDeleteChat._id})
    }
    useEffect(()=>{
        if(deleteChatData || LeaveGroupData) nav("/")

    },[deleteChatData,LeaveGroupData])

    return (
    <Menu
     onClose={closeHandler} 
     open={isDeleteMenu} 
     anchorOrigin={{vertical:"bottom" , horizontal:"right"}}
     anchorEl={deleteOptionAnchor.current}
     transformOrigin={{vertical:"center",horizontal:"center"}}>
     
        <Stack
         sx={{
            width:"7rem",
            padding:"0.5rem",
            cursor:"pointer",
            color:"grey",
            boxSizing:"border-box"
            
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={selectedDeleteChat.groupChat?LeaveGroup:Unfriend}
        >
        {
            selectedDeleteChat.groupChat ? <><ExitToApp/>
            <Typography>Leave Group</Typography>
            </> :
            <><Delete/>
            <Typography>Remove</Typography>
            </> 
        }
        </Stack>
    </Menu>
  )
}

export default DeleteChatMenu
