import { Stack , Dialog, DialogTitle, Typography, Button } from '@mui/material'
import React,{useState } from 'react'
import UserItem  from "../../componets/shared/UserItem";
import { SampleUsers } from '../../constant/SampleData';
const AddMemberDialog = ({addMember, isLoadingAddmember ,chatId}) => {

const [members, setmembers] = useState(SampleUsers)
const [selectedMembers, setselectedMembers] = useState([])
    const selectMemberHandler = (id)=>{
         setselectedMembers((prev)=>(prev.includes(id) ? prev.filter((currentElementId)=> currentElementId!=id )  :[...prev,id]))
    };
    console.log(selectedMembers)

const addMemberSubmitHandler=()=>{

}
const closeHandler=()=>{
setmembers([])
setselectedMembers([]);
}
    return (
    <Dialog open> 
            <Stack spacing={"rem"}>
                <DialogTitle>
                    Addmember
                </DialogTitle>
            </Stack>
            <Stack spacing={"2rem"} p={"rem"}>
                {SampleUsers.length>0 ? 
                    SampleUsers.map((i)=>[
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
                onClick={closeHandler}
                >Submit changes</Button>
                <Button color='error' onClick={addMemberSubmitHandler} 
                    disabled={isLoadingAddmember}
                >Cancel</Button>
            </Stack>
    </Dialog>
  )
}

export default AddMemberDialog
