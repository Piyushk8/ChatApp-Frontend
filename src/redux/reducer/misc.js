import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isProfile:false,
  isNewGroup:false,
  isAddMember: false,
  isNotification: false,
  isMobile: false,
  isSearch: false,
  isFileMenu: false,
  isDeleteMenu: false,
  uploadingLoader: false,
  selectedDeleteChat: {
    chatId: "",
    groupChat: false,
  },
  chatIdContextMenu:null,
  isEditName:false
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsNewGroup: (state, action) => {
      state.isNewGroup = action.payload;
    },
    setIsAddMember: (state, action) => {
      state.isAddMember = action.payload;
    },
    setIsNotification: (state, action) => {
      state.isNotification = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsFileMenu: (state, action) => {
      state.isFileMenu = action.payload;
    },
    setIsDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setSelectedDeleteChat: (state, action) => {
      state.selectedDeleteChat = action.payload;
    },
    setIsProfile: (state, action) => {
      state.isProfile = action.payload;
    },
    setChatIdContextMenu:(state,action)=>{
      state.chatIdContextMenu = action.payload;
    },removeChatIdContextMenu:(state)=>{
        state.chatIdContextMenu=null
    },setIsEditName:(state,action)=>{
      state.isEditName=action.payload
    }

  },
});

export default miscSlice;
export const {
  setIsEditName,
  setIsNewGroup,
  setIsAddMember,
  setIsNotification,
  setIsMobile,
  setIsSearch,
  setIsFileMenu,
  setIsDeleteMenu,
  setUploadingLoader,
  setSelectedDeleteChat,
  setIsProfile
  ,setChatIdContextMenu
  ,removeChatIdContextMenu
} = miscSlice.actions;