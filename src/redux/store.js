import {configureStore} from "@reduxjs/toolkit"
import { authSlice } from "./reducer/auth";
import miscSlice from "./reducer/misc"
import chatSlice from "./reducer/chat"
import api from "./api/api";
const store = configureStore({
    reducer:{
        [authSlice.name] : authSlice.reducer,
        [api.reducerPath] :api.reducer,
        [miscSlice.name]:miscSlice.reducer,
        [chatSlice.name]:chatSlice.reducer
    },
    middleware:(mid)=>[...mid() , api.middleware]
});


export default store