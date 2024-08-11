import { Dialog, DialogTitle, Stack, Typography,ListItem,Avatar, Button, TextField, Skeleton } from '@mui/material'
import React,{memo,useEffect,useState} from 'react'
import { SampleUsers } from "../../constant/SampleData"
import UserItem from "../shared/UserItem"
import { Padding } from '@mui/icons-material'
import { useInputValidation } from '6pp'
import {useAsyncMutation, useErrors} from "../../hooks/hook"
import {useAvailableFriendsQuery, useCreateNewGroupMutation} from "../../redux/api/api"
import { useDispatch, useSelector } from 'react-redux'
import { setIsNewGroup } from '../../redux/reducer/misc'
import toast from 'react-hot-toast'

const NewGroup = () => {
  const {isNewGroup} = useSelector((state)=>state.misc)
  const dispatch = useDispatch();
  const [selectedMembers, setselectedMembers] = useState([])

  var {isError,error,data,isLoading} = useAvailableFriendsQuery("")
  const [newGroup,groupLoading] = useAsyncMutation(useCreateNewGroupMutation)
    
  const groupName = useInputValidation("");
  const selectMemberHandler = (id)=>{
        setselectedMembers((prev)=>(prev.includes(id) ? prev.filter((currentElementId)=> currentElementId!=id )  :[...prev,id]))
  };
  
    const submitHandler = ()=>{
      if(!groupName.value) return toast.error("Group Name Required")
      if(selectedMembers.length<2) return toast.error("Atleast 3 members required")
      newGroup("creating new group..",{name:groupName.value,members:selectedMembers})
      CloseHandler()
      }
    const CloseHandler =()=>{
      dispatch(setIsNewGroup(false))
    }
    const errors = [{
      isError:isError,
      error:error
    }]
    

    useErrors(errors)
  return (
    <Dialog open={isNewGroup}
    fullWidth 
      sx={{}}
    onClose={CloseHandler}>
      <Stack spacing={"2rem"} p={{xs:"1rem" , sm:"2rem"}} maxWidth={"40rem"}>
        <DialogTitle
          sx={{alignSelf:"center",
            color:'grey',
            font:"menu"
            ,fontSize:"1.3rem"
          }}
        >
        New Group
        </DialogTitle>

        <TextField placeholder='Group Name here....'
           value={groupName.value}
          onChange={groupName.changeHandler}
          sx={{bgcolor:'#f5f5f5'}}
          ></TextField>
        <Typography pl={"2rem"} variant='body1'
          sx={{font:"menu",fontSize:{sm:"1rem",md:"1.5rem"}
          }}  
        >Add Members </Typography>
        
        <Stack maxWidth={"40rem"} p={{md:"2rem"}}>
          {
            isLoading ? <Skeleton/> : (data?.friends.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}  
              />)))
          }
            
        </Stack >
            <Stack direction={"row"} justifyContent={"space-around"}> 
                <Button size='large' variant={"text"} color="error" onClick={CloseHandler} disabled={groupLoading}> Cancel</Button>
                <Button 
                sx={{ 
                  bgcolor: '#215C54', 
                  '&:hover': { 
                    bgcolor: '#1b4a44'  
                  } 
                }}
                 size="large" variant={"contained"} onClick={submitHandler} disabled={groupLoading}>Create</Button>
            </Stack>

      </Stack>


  </Dialog>
  )
}

export default NewGroup
