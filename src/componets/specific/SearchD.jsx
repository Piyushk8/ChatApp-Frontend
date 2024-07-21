import {useInputValidation} from "6pp"
import {Dialog, DialogTitle, InputAdornment, List, Skeleton, Stack, TextField } from '@mui/material'
import React,{useState,useEffect} from 'react'
import {Search as SearchIcon} from "@mui/icons-material/"
import UserItem from "../shared/UserItem"
import { SampleUsers } from "../../constant/SampleData"
import { useDispatch, useSelector } from "react-redux"
import { setIsSearch } from "../../redux/reducer/misc"
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api"
import toast from "react-hot-toast"
import { useAsyncMutation } from "../../hooks/hook.jsx"
const SearchD = () => {

  //all redux tasks
  const dispatch = useDispatch();
  const {isSearch} = useSelector((state)=>state.misc)

  //all api imports
  const [sendFriendRequest, isLoadingFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);
  const [searchUser , isLoading] = useLazySearchUserQuery()
  const [isskeleton,setIsSkeleton] = useState(true)
  
  //all handlers
  const searchCloseHandler = () => {
    dispatch(setIsSearch(false))
  }
  

  const addFriendHandler = async(id)=>{
   await sendFriendRequest("sending Friend Request" , {ReceiverId:id})

  }


  const [users, setUsers] = useState([])
  const search = useInputValidation("")
  const isLoadingSendFriend = false;
  
  useEffect(() => {  
    const timeoutId = setTimeout(()=>{
       searchUser(search.value)
       .then(({data})=>{
        setIsSkeleton(false)
        setUsers(data.Users)})    //Debouncing
       .catch((e)=>console.log(e))
      }
      ,2000)

  return ()=>{
    clearTimeout(timeoutId)
  }}, [search.value])
  

  return (
   <Dialog open={isSearch} onClose={searchCloseHandler}>
    <Stack p={"2rem"} direction={"column"} width={"25rem"}>
      <DialogTitle textAlign={"center"}>Find people</DialogTitle>
        <TextField label="" value={search.value} onChange={search.changeHandler}
        variant="outlined"
        size="small"
        inputProps={{
          startAdornment:(
            <InputAdornment position="start">
            <SearchIcon/>
            </InputAdornment>
          )
        }}
        ></TextField>

         {
            (isskeleton) ? <Skeleton height={"20vh"}/>:
            <Stack>
          {users.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              avatar={i.avatar.url}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriend}
            />
          ))}
        </Stack>
          
         }

    </Stack>
    


   </Dialog>
  )
}

export default SearchD
