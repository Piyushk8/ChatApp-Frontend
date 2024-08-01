import { Stack , Dialog, DialogTitle, Typography, Button } from '@mui/material'
import React,{useState } from 'react'
import UserItem  from "../../componets/shared/UserItem";
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { SampleUsers } from '../../constant/SampleData';
import { useDispatch,useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducer/misc';
const AddMemberDialog = ({chatId}) => {
    const dispatch = useDispatch()
//RTK QUERIES
    const [addMember ,isLoadingAddMember  ] = useAsyncMutation(useAddGroupMemberMutation)
    const {isError,isLoading,error,data} = useAvailableFriendsQuery(chatId)
    //states
     const [selectedMembers, setselectedMembers] = useState([])

    const { isAddMember} = useSelector((state)=>state.misc)

console.log(data)
    const errors = [{
        isError:isError,
        error:error
    }]

    const selectMemberHandler = (id)=>{
        setselectedMembers((prev)=>(prev.includes(id) ? prev.filter((currentElementId)=> currentElementId!=id )  :[...prev,id]))
    };
       // console.log(selectedMembers)

    const addMemberSubmitHandler=()=>{
        addMember("Adding members..",{chatId,members:selectedMembers})
    }
    const closeHandler=()=>{
    dispatch(setIsAddMember(false))
    }


    useErrors(errors)
    return (
    <Dialog open={isAddMember} onClose={closeHandler}> 
            <Stack spacing={"rem"}>
                <DialogTitle>
                    Addmember
                </DialogTitle>
            </Stack>
            <Stack spacing={"2rem"} p={"rem"}>
                {data?.transformedFriends?.length>0 ? 
                    data?.transformedFriends.map((i)=>[
                        <UserItem user={i} 
                        isAdded={selectedMembers.includes(i._id)}
                        handler={selectMemberHandler}></UserItem>
                    ]) :
                    <Typography textAlign={"center"}>
                        no friends
                    </Typography>
                }
            </Stack>
            <Stack direction={"row"} alignItems={"center"}>
                <Button variant='contained'
                onClick={addMemberSubmitHandler}
                >Submit changes</Button>
                <Button color='error' onClick={closeHandler} 
                    disabled={isLoadingAddMember}
                >Cancel</Button>
            </Stack>
    </Dialog>
  )
}

export default AddMemberDialog
