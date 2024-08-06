import { Stack , Dialog, DialogTitle, Typography, Button } from '@mui/material'
import React,{useState } from 'react'
import UserItem  from "../../componets/shared/UserItem";
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useAddGroupMemberMutation, useAvailableFriendsQuery,useChatDetailsQuery } from '../../redux/api/api';
import { SampleUsers } from '../../constant/SampleData';
import { useDispatch,useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducer/misc';
const AddMemberDialog = ({chatId}) => {
    const dispatch = useDispatch()
//RTK QUERIES
    const {refetch:refetchGroupDetails} = useChatDetailsQuery({chatId , populate:true},{skip:!chatId})
  
    const [addMember ,isLoadingAddMember  ] = useAsyncMutation(useAddGroupMemberMutation)
    const {isError,isLoading,error,data} = useAvailableFriendsQuery(chatId)
    //states
    const [selectedMembers, setselectedMembers] = useState([])

    const { isAddMember} = useSelector((state)=>state.misc)

    const errors = [{
        isError:isError,
        error:error
    }]

    const selectMemberHandler = (id)=>{
        setselectedMembers((prev)=>(prev.includes(id) ? prev.filter((currentElementId)=> currentElementId!=id )  :[...prev,id]))
    };

    const addMemberSubmitHandler=async()=>{
        await addMember("Adding members..",{chatId,members:selectedMembers})
        refetchGroupDetails()
        dispatch(setIsAddMember(false))
    };
    

    const closeHandler=()=>{
    dispatch(setIsAddMember(false))
    };

    useErrors(errors)

    return (
    <Dialog maxWidth={"lg"} 
            sx={{
                backdropFilter: 'blur(1px)', // Apply blur to the backdrop  
            }}
        
         open={isAddMember}
        onClose={closeHandler}> 
            <Stack spacing={"rem"}>
                <DialogTitle 
                textAlign={"center"}
                    fontSize={"2rem"}
                    >
                    Add Members
                </DialogTitle>
            </Stack>
            <Stack spacing={"2rem"} p={"rem"}>
                {data?.friends?.length>0 ? 
                    data?.friends.map((i)=>{
                     return  <UserItem user={i} 
                                isAdded={selectedMembers.includes(i._id)}
                                handler={selectMemberHandler}>

                                </UserItem>
                     }) :
                <Typography textAlign={"center"} color={"grey"}>
                    Already added all friends! 
                     <br></br>
                    make new Friends
                </Typography>
                }
            </Stack>
            <Stack marginX={"2rem"} 
                marginY={"1rem"}
                direction={"row"} 
                alignItems={"center"} 
                spacing={"3rem"}>
                <Button variant='contained'
                onClick={addMemberSubmitHandler}
                >Submit</Button>
                <Button color='error' onClick={closeHandler} 
                    disabled={isLoadingAddMember}
                >Cancel</Button>
            </Stack>
    </Dialog>
  )
}

export default AddMemberDialog
