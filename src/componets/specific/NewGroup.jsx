import { Dialog, DialogTitle, Stack, Typography,ListItem,Avatar, Button, TextField } from '@mui/material'
import React,{memo,useState} from 'react'
import { SampleUsers } from "../../constant/SampleData"
import UserItem from "../shared/UserItem"
import { Padding } from '@mui/icons-material'
import { useInputValidation } from '6pp'

const NewGroup = () => {
    const [members, setmembers] = useState(SampleUsers)
    const [selectedMembers, setselectedMembers] = useState([])

    const groupName = useInputValidation("");
    const selectMemberHandler = (id)=>{
         setselectedMembers((prev)=>(prev.includes(id) ? prev.filter((currentElementId)=> currentElementId!=id )  :[...prev,id]))
    };
    console.log(selectedMembers)
    const submitHandler = ()=>{}
    const CloseHandler =()=>{}
  return (
    <Dialog open fullWidth>
    <Stack spacing={"2rem"} p={{xs:"1rem" , sm:"2rem"}} maxWidth={"40rem"}>
    <DialogTitle>
     New Group
    </DialogTitle>

    <TextField label="" value={groupName.value} onChange={groupName.changeHandler}></TextField>
    <Typography textAlign={"center"} variant='body1'>Members </Typography>
    
    <Stack maxWidth={"40rem"} p={{md:"2rem"}}>
    {members.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(i._id)}  
            />
          ))}
    </Stack >
        <Stack direction={"row"} justifyContent={"space-around"}> 
            <Button size='large' variant={"text"} color="error">Cancel</Button>
            <Button size="large" variant={"contained"} onClick={()=>submitHandler} >Create</Button>
        </Stack>

    </Stack>


  </Dialog>
  )
}

export default NewGroup
