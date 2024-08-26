import React, { memo ,useEffect,useState} from "react";
import { LinkComponent } from "../StyledComponent";
import { Box, Divider, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";
import {useSelector,useDispatch} from "react-redux"
import { setIsDeleteMenu } from '../../redux/reducer/misc'
//import {} from '@material-ui/icons';
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
  PushPin,
  PushPinRounded,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { setPinnedChats } from "../../redux/reducer/chat";
const ChatItem = ({
  avatar = [],
  lastSeen,
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  lastMessage,
  newMessageAlert,
  index = 0,
  pinned,
  handleDeleteChat,
}) => {
  const { user }= useSelector((state)=>state.auth)
  const FriendName = name.split("-").filter((i)=> i!==user.name)

  return (
    <LinkComponent
      to={`/chats/${_id}`}
      sx={{width:"100%"}}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <Stack>
      <motion.div
      initial={{ opacity: 0, y: '-100%' }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      style={{
        width:"100%",
        display: 'flex',
        alignItems: 'center',
        transform:"scale(2)",
       borderLeft:`7px solid ${sameSender? "darkgreen":"#E5E4E2"}`, 
       borderRadius:"1rem",
       color: sameSender ? '' : 'unset',
        // position: 'relative',
        paddingTop:"10px",
        paddingBottom:"1rem",
        paddingRight:"9px",
        marginBottom: '2px',
        marginTop: '10px',
        // borderBottom: '1px solid',
        // borderBottomColor: 'lightgrey',
        wordBreak: 'break-word',
        
      }}
      
      >
          
          {isOnline && (
            <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "1",
              left: "1",
              marginLeft:"10px",
              zIndex:1,
              transform: "translateY(-200%)",
              animation: 'glow 1.5s forwards', // Apply the glow animation once
              '@keyframes glow': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(0, 255, 0, 1)',
                  //transform: 'scale(1)',
                },
                '100%': {
                  boxShadow: '0 0 8px 8px rgba(0, 255, 0, 0)',
                  //transform: 'scale(1.2)', // Slightly scale up for a glowing effect
                },
              },
            }}
            />
          )}
        <AvatarCard isOnline={isOnline} avatar={avatar} />

        <Stack  width={"100%"} direction={"row"} display={"flex"} justifyContent={"space-between"}>
          <Stack display={"flex"} justifyContent={"space-between"} maxWidth={"7.5rem"}>
          <Typography sx={{
            flexShrink:1,
            fontSize:{"md":"0.9rem","xs":"0.7rem"},
            width:"7.5rem",
            fontFamily:'',
            height:"1.1rem",
            fontWeight:"bold",
            overflow:"hidden",whiteSpace:'nowrap',textOverflow:"ellipsis"}}>{FriendName}</Typography>
          <Typography flexShrink={1} sx={{color:"gray",fontSize:"15px",}} >{lastMessage}</Typography>
          </Stack>
          <Stack display={"flex"} flexShrink={5} flexDirection={"column"} justifyContent={"space-between"}>
              <Box sx={{color:"gray" ,fontSize:{"md":"10px","xs":"9px"}}}>{lastSeen}</Box>
            <Box sx={{height:{"md":"20px","xs":"15px"}}}>
              {pinned &&
              <PushPinRounded sx={{color:"GrayText",fontSize:"",transform:"rotate(30deg)"}}/>
              }
            </Box>
            <Box marginTop={"10px"} maxHeight={"20px"} maxWidth={"20px"} > {
              newMessageAlert 
              && <Box  
                  display={"flex"} 
                  justifyContent={"center"} 
                  alignItems={"center"} 
                  sx={{fontSize:"10px", bgcolor:"gray" ,textAlign:"center",borderRadius:"100%",color:"white",width:"20px",height:"20px"}}>
                    {newMessageAlert.count}</Box>
              } </Box>
          </Stack>
        </Stack>
      </motion.div>
        <Divider sx={{alignSelf:"end",width:"80%"}}/>
      </Stack>
    </LinkComponent>
  );
};

export default memo(ChatItem);