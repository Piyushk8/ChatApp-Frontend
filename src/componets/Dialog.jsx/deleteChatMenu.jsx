import { Box, Menu, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { removeChatIdContextMenu, setIsDeleteMenu } from '../../redux/reducer/misc'
import { Delete, DoneAllSharp, ExitToApp, PushPin } from '@mui/icons-material'
import { useAsyncMutation, useSocketEvents } from '../../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'
import { useNavigate } from 'react-router-dom'
import { deleteFromPinnedChats, removeNewMessagesAlert, setPinnedChats } from '../../redux/reducer/chat'
import {motion} from "framer-motion"
const DeleteChatMenu = ({chatId,dispatch ,socket, deleteOptionAnchor}) => {
    const {isDeleteMenu,selectedDeleteChat,chatIdContextMenu} = useSelector((state)=>state.misc)
    const { pinnedChats} = useSelector((state)=>state.chat)
   const {user} = useSelector((state)=>state.auth)
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

    const pinChatHandler =()=>{
        closeHandler()
        socket.emit("pinchat",{pinned:true,userId:user._id,chatId:chatIdContextMenu})     
         dispatch(setPinnedChats(chatIdContextMenu))
    }
    const unPinChatHandler =()=>{
    closeHandler()
        socket.emit("pinchat",{pinned:false,userId:user._id,chatId:chatIdContextMenu})     
        dispatch(deleteFromPinnedChats(chatIdContextMenu))
    }
   
      
    return (
    <Menu
     onClose={closeHandler} 
     open={isDeleteMenu} 
     anchorOrigin={{vertical:"bottom" , horizontal:"right"}}
     anchorEl={deleteOptionAnchor.current}
     transformOrigin={{vertical:"center",horizontal:"center"}}>
     
     <Stack
            sx={{
                width: "10rem",  // Adjusted width for better layout
                padding: "0.5rem",
                cursor: "pointer",
                color: "grey",
                boxSizing: "border-box",
            }}
            spacing={"1rem"}
        >
            <Box
                sx={{"&:hover":{bgcolor:"#EAEAEA"}}}
              onClick={selectedDeleteChat.groupChat?LeaveGroup:Unfriend}
              display={"flex"} alignItems={"center"} gap={"0.5rem"}>
                {selectedDeleteChat.groupChat ? (
                    <>
                        <motion.div
                        whileHover={{ scale: 1.4, rotate: [0, 30, -30, 0], transition: { duration: 0.3 } }} style={{ display: 'inline-block' }}
                        >
                            <ExitToApp  fontSize='extrasmall'/>
                        </motion.div>
                        <Typography>Leave Group</Typography>
                    </>
                ) : (
                    <>
                    <motion.div
                        whileHover={{ scale: 1.4, rotate: [0, 20, -20, 0], transition: { duration: 0.5 } }} style={{ display: 'inline-block' }}
                        >
                        <Delete fontSize='extrasmall' />
                        </motion.div>
                        <Typography>Remove</Typography>
                    </>
                )}
            </Box>
            {
                pinnedChats?.includes(chatIdContextMenu) ||false 
                ?
                <Box sx={{"&:hover":{bgcolor:"#EAEAEA"}}} onClick={unPinChatHandler} display={"flex"} alignItems={"center"} gap={"0.5rem"}>
                    
                    <motion.div
                        whileHover={{ rotate: [0, 45, -45, 0], transition: { duration: 0.5 } }}
                        style={{ display: 'inline-block' }}
                    >
                        <PushPin fontSize='extrasmall' sx={{transform:"rotate(30deg)","&:hover":{transform:"rotate(0deg)"}}} />
                    </motion.div>
                    <Typography sx={{textDecoration:""}}>Un pin</Typography>
                </Box> :
                    <Box sx={{"&:hover":{bgcolor:"#EAEAEA"}}} onClick={pinChatHandler} display={"flex"} alignItems={"center"} gap={"0.5rem"}>
                    <PushPin sx={{transform:"rotate(30deg)","&:hover":{transform:"rotate(60deg)"}}} fontSize='extrasmall' />
                 <Typography sx={{textDecoration:""}}>Pin Chat</Typography>
             </Box> 
            }
            <Box 
            sx={{"&:hover":{bgcolor:"#EAEAEA"}}}
             display={"flex"} alignItems={"center"} gap={"0.5rem"}>
                 <motion.div
                        whileHover={{ scale: 1.4, transition: { duration: 0.3 } }} style={{ display: 'inline-block' }}
                    >
                <DoneAllSharp fontSize='extrasmall'/>
                 </motion.div>
                <Typography
                onClick={()=>{dispatch(removeNewMessagesAlert(chatIdContextMenu))
                    dispatch(removeChatIdContextMenu())
                }}
                >Mark as Read</Typography>
            </Box>
        </Stack>
    </Menu>
  )
}

export default DeleteChatMenu

//onClick={selectedDeleteChat.groupChat?LeaveGroup:Unfriend}