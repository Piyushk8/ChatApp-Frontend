import React, { memo ,useState} from "react";
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
} from "@mui/icons-material";
import { Link } from "react-router-dom";
const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {

  
  const { user }= useSelector((state)=>state.auth)
  const FriendName = name.split("-").filter((i)=> i!==user.name)

  return (
    <LinkComponent
      to={`/chats/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <Stack>
      <motion.div
      initial={{ opacity: 0, y: '-100%' }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        backgroundColor: sameSender ? '#054640' : 'unset',
        color: sameSender ? 'white' : 'unset',
        position: 'relative',
        padding: '1rem',
        marginBottom: '2px',
        // borderBottom: '1px solid',
        // borderBottomColor: 'lightgrey',
        // wordBreak: 'break-word',
        
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
              marginLeft:"3px",
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

        <Stack>
          <Typography sx={{
            fontFamily:'',
            overflow:"hidden",whiteSpace:'nowrap',textOverflow:"ellipsis"}}>{FriendName}</Typography>
          {newMessageAlert && (
            <Typography sx={{fontSize:"0.7rem",color:"gray"}}>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>
      </motion.div>
        <Divider sx={{alignSelf:"end",width:"80%"}}/>
      </Stack>
    </LinkComponent>
  );
};

export default memo(ChatItem);