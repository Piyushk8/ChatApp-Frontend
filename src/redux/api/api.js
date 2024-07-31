
import {createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {server} from "../../constant/config.js"


const api = createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({baseUrl:`${server}/api/v1/`}),
    tagTypes:["Chat","user", "message"],

    endpoints:(builder) =>({
        myChats:builder.query({
            query:()=>({url:"chat/my" , 
                credentials:"include"
            }),
            provideTags:["Chats"]
        }),
        searchUser:builder.query({
            query:(name)=>({url:`user/search?name=${name}`,
                credentials:"include"
            }),
            providesTags:["user"]
        }),
        sendFriendRequest:builder.mutation({
            query:(id)=>({
                url:`user/sendRequest`,
                method:"PUT",
                credentials:"include",
                body:id,
            }),
            invalidatesTags:["user"]
        }),
        getNotifications:builder.query({
            query:()=>({url:`user/notifications`,
                credentials:"include"
            }),
            keepUnusedDataFor:0,
        }),
        AcceptFriendRequest:builder.mutation({
            query:(data)=>({
                url:`user/acceptRequest`,
                method:"DELETE",
                credentials:"include",
                body:data,
            }),
            invalidatesTags:["Chat"]
        }),
        
        chatDetails:builder.query({
            query:({chatId ,populate =false})=>{
                let url = `chat/${chatId}`
                if(populate) url += "?populate=true"

                return{url,
                credentials:"include"}
            },
            providesTags:["Chat"],
        }),
        getMessages:builder.query({
            query:({chatId ,page})=>({
                url:`chat/message/${chatId}?page=${page}`,
                credentials:"include"
            }),
            providesTags:["message"],
        }),
        sendAttachments:builder.mutation({
            query:(data)=>({
                url:`chat/message`,
                method:"post",
                credentials:"include",
                body:data,
            }),
            invalidatesTags:["user"]
        }),


    })
})
export default api
export const  {useSendAttachmentsMutation,useAcceptFriendRequestMutation,useGetNotificationsQuery,useMyChatsQuery ,useSendFriendRequestMutation, useLazySearchUserQuery , useChatDetailsQuery,useGetMessagesQuery} = api;