import { Stack } from "@mui/material";
import React from "react";
import ChatItem from "../shared/ChatItem";
import { useSelector } from "react-redux";
import { formatDate } from "../../lib/features";
const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],user,
  handleDeleteChat,
}) => {
   //console.log(user)
   let sortedChats = chats
   //to sort the chats when pinned
   const {pinnedChats }= useSelector((state)=>state.chat)
    if(chats){
      const pinchat = chats?.filter((i)=>pinnedChats.includes(i._id))
      const nonPinchat = chats?.filter((i)=>!pinnedChats.includes(i._id))
      sortedChats = [...pinchat,...nonPinchat]

    }


   return (
    <Stack 
      sx={{ background:"#E5E4E2",
        boxShadow: '4px 4px 8px rgba(0, 0, 0, 5)', 
      }}
      width={w} direction={"column"} overflow={"auto"} height={"100%"}>
      {sortedChats?.map((data, index) => {
        const { avatar, _id, name, groupChat,updatedAt,members ,lastMessage} = data;
        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );
        const pinned =  pinnedChats?.includes(_id) ||false
        const isOnline = members?.some((i)=> onlineUsers.includes(i._id))
        const lastSeen = formatDate(updatedAt)
       

        return (
          <ChatItem
          lastSeen={lastSeen}
          pinned={pinned}
            lastMessage={lastMessage}
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;