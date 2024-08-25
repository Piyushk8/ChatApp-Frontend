import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    isAdmin:false,
    Loader:true,
    isAuthenticated:true
}

const authSlice  = createSlice({
    name:"auth",
    initialState,
    reducers:{
        userExists:(state,action)=>{
            state.user=action.payload
            state.Loader=false
        },
        userNotExists:(state)=>{
            state.user=null,
            state.Loader=false
        }, setIsAuthenticated:(state,action)=>{
            state.isAuthenticated=action.payload
        },
    }
});



export {authSlice};
export const {userExists ,setIsAuthenticated, userNotExists} = authSlice.actions;