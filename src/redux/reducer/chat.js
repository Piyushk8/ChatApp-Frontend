import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveFromStorage } from "../../lib/features";
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../constant/events";

const initialState = {
  //notificationCount: 0,
  notificationCount:getOrSaveFromStorage({
    key:NEW_REQUEST,get:true
  }) || {
    Count:0
  },
  pinnedChats:[]
  ,
  newMessagesAlert: getOrSaveFromStorage({
    key: NEW_MESSAGE_ALERT,
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
  
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setPinnedChatsArray:(state,action)=>{
      state.pinnedChats = action.payload
    },
   setPinnedChats:(state,action)=>{
    if(!state.pinnedChats.includes(action.payload)) state.pinnedChats.push(action.payload)
   },
   deleteFromPinnedChats:(state,action)=>{
    if(state.pinnedChats.includes(action.payload)) {
     state.pinnedChats =  state.pinnedChats.filter((i)=>i!==action.payload)
      
    }}
    ,
    incrementNotification: (state) => {
      state.notificationCount.Count += 1;
      getOrSaveFromStorage({
        key: NEW_REQUEST,
        value: state.notificationCount,
        get: false,
      }); // Save to local storage
    },
    resetNotificationCount: (state) => {
      state.notificationCount.Count = 0;
      getOrSaveFromStorage({
        key: NEW_REQUEST,
        value: state.notificationCount,
        get: false,
      }); // Save to local storage
    },

    setNewMessagesAlert: (state, action) => {
      const chatId = action.payload.chatId;

      const index = state.newMessagesAlert.findIndex(
        (item) => item.chatId === chatId
      );

      if (index !== -1) {
        state.newMessagesAlert[index].count += 1;
      } else {
        state.newMessagesAlert.push({
          chatId,
          count: 1,
        });
      }
    },

    removeNewMessagesAlert: (state, action) => {
      state.newMessagesAlert = state.newMessagesAlert.filter(
        (item) => item.chatId !== action.payload
      );
    },
  },
});

export default chatSlice;
export const {setPinnedChatsArray,
  deleteFromPinnedChats,
  setPinnedChats,
  incrementNotification,
  resetNotificationCount,
  setNewMessagesAlert,
  removeNewMessagesAlert,
} = chatSlice.actions;