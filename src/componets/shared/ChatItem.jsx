import React, { memo } from "react";
import { LinkComponent } from "../StyledComponent";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";
import {useSelector} from "react-redux"

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
      sx={{
        padding: "0",
      }}
      to={`/chats/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          backgroundColor: sameSender ? "#054640" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
          padding: "1rem",
          marginBottom: "2px",
          borderBottom:"1px solid",
          borderBottomColor:"lightgrey",
          // boxShadow:" 0 2px 4px rgba(0, 0, 0, 0.1)"
          wordBreak:"break-word"
        }}
      >
        <AvatarCard avatar={avatar} />

        <Stack>
          <Typography>{FriendName}</Typography>
          {newMessageAlert && (
            <Typography sx={{fontSize:"0.7rem",color:"gray"}}>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>

        {isOnline && (
          <Box
            sx={{
              
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </motion.div>
    </LinkComponent>
  );
};

export default memo(ChatItem);