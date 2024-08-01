import { Link,Box, Drawer, Grid, IconButton, Tooltip ,Stack, Typography, Avatar, TextField, Button, Backdrop, Skeleton, CircularProgress} from '@mui/material'
import React,{lazy, memo, Suspense, useEffect, useState} from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate,useSearchParams} from "react-router-dom"
import {Add, Delete, Done, Edit as EditIcon, KeyboardBackspace} from "@mui/icons-material"
import {LinkComponent} from "../componets/StyledComponent"
import AvatarCard from '../componets/shared/AvatarCard';
//import {SampleData, SampleUsers} from "../constant/SampleData"
import UserItem from '../componets/shared/UserItem';
import { useAddGroupMemberMutation, useChatDetailsQuery, useDeleteChatMutation, useGetMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors, useSocketEvents } from '../hooks/hook';
import Layoutloader from '../componets/Loaders/Layoutloader';
import { motion } from "framer-motion";
import { REFETECH_CHATS } from '../constant/events';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducer/misc';

const ConfirmDeleteDialog = lazy(()=>import("../componets/Dialog.jsx/ConfirmDeleteDialog"))
const AddMemberDialog = lazy(()=>import("../componets/Dialog.jsx/AddMemberDialog"))


function Group() {
  const dispatch = useDispatch();
  //! states
  const chatId = useSearchParams()[0].get("group");
  
  const [isMobileMenuOpen, setisMobileMenuOpen] = useState(false);
  const [isEdit, setisEdit] = useState(false)
  const { isAddMember} = useSelector((state)=>state.misc)

  const [groupName, setgroupName] = useState("")
  const [members, setmembers] = useState([])
  const [groupNameUpdatedValue, setgroupNameUpdatedValue] = useState("")
  const [confirmDeleteDialog,setconfirmDeletDialog] = useState(false)
  

//RTK QUERIES
const myGroups = useGetMyGroupsQuery("");

const groupDetails = useChatDetailsQuery({chatId , populate:true},{skip:!chatId})
const [deleteGroup , isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation)

const [renameGroup ,isLoadingGroupName ] = useAsyncMutation(useRenameGroupMutation)

const [removeMember ,isLoadingRemoveMember  ] = useAsyncMutation(useRemoveGroupMemberMutation)

const errors=[{
  isError:myGroups.isError,
  error:myGroups.error
},{
  isError:groupDetails.isError,
  error:groupDetails.error
}]

useErrors(errors)



useEffect(()=>{
  if(groupDetails.data){
    setgroupName(groupDetails.data.chat.name)
    setgroupNameUpdatedValue(groupDetails.data.chat.name)
    setmembers(groupDetails?.data?.chat?.members)
  }
  return ()=>{
    setgroupName("")
    setgroupNameUpdatedValue("");
    setmembers([])
    setisEdit(false)
  }
},[groupDetails.data,myGroups.data])

//!functions
const navigate = useNavigate();
const navigateBack = ()=>{
  navigate("/")
}
const handleMobile = ()=>{
  setisMobileMenuOpen((prev)=>!prev)
}
const handleMobileClose=()=>{setisMobileMenuOpen(false)}


const updateGroupName = ()=>{
  setisEdit(false);
  renameGroup("Group name updated!",{chatId,name:groupNameUpdatedValue})
  
}

const OpenconfirmDeleteHandler=()=>{
  setconfirmDeletDialog(true)
}
const CloseConfirmDeleteHandler = ()=>{
  setconfirmDeletDialog(false)
  }
  const openAddMemberHandler=()=>{
    dispatch(setIsAddMember(true))
  }
  const deleteHandler=()=>{
    deleteGroup("Deleting group..",{id:chatId})
    CloseConfirmDeleteHandler()
    nav("/")
  }
  const removeMemberHandler =(id)=>{
    removeMember("Removing member",{chatId,userId:id});
  }
  // useEffect(()=>{
  //   if(chatId){
  //     setgroupName(`groupname ${chatId}`);
  //   setgroupNameUpdatedValue(`updated value ${chatId}`)
  //   }
    
  //   return (()=>{setgroupName("")
  //   setgroupName("")})

  // },[chatId])

  // JSX Components for the main body icons 

    const IconButns = <>
    <Box sx={{
      display:{xs:"block" , sm:"none" , position:"fixed"
        ,top:"1rem" ,right:"1rem"
      }
    }}>
      <IconButton onClick={handleMobile}>  
        <MenuIcon></MenuIcon>
      </IconButton>
      </Box>

      <Tooltip title="back" sx={{
        position:"absolute",
        top:"2rem",
        left:"2rem",
        bgcolor:"rgba(0,0,0,0.8)",
        color:"white",
        "&:hover":{
          bgcolor:"rgba(0,0,0,0.9)"
        }

      }}>
        <IconButton onClick={navigateBack}> <KeyboardBackspace></KeyboardBackspace></IconButton>
      </Tooltip>
      </>

//Jsx for the main body group creation  
     const GroupName = 
     <>
     <Stack direction={"row"}
     alignItems={"center"}
     justifyContent={"center"}
     spacing={"1rem"}
     padding={"3rem"}
     >
      {isEdit ? 
      <>
          <TextField value={groupNameUpdatedValue} 
          onChange={(e)=>setgroupNameUpdatedValue(e.target.value)}></TextField>
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}><Done/></IconButton>
      </>
      :
      <>      
          <Typography variant='H4'>{groupName}</Typography>
          <IconButton disabled={isLoadingGroupName} onClick={()=>setisEdit(true)}>
           <EditIcon></EditIcon>
          </IconButton>
      </>

      }
     </Stack>
     
    </>

//!main start
return myGroups.isLoading ? <Layoutloader/> :
   (<Grid container height={"100vh"}>
        <Grid item sx={{
            display:{xs:"none" ,sm:"block"}
          ,bgcolor:"gray"}}
          sm={4}
          > 
          <GroupsList chatId={chatId} myGroups={myGroups.data.transformedGroups} w={"50vw"}/>
          
          </Grid>
        <Grid item sm={8} xs={12}
            sx={{display:"flex" , flexDirection:"column" , 
            alignItems:"center", position:"relative",
            padding:"1rem 3rem" }}> {IconButns}
            {
              <>
              {GroupName}
            

            
              <Typography 
                margin={"2rem"}
                alignSelf={"flex-start"}
                variant='body1'
                >Members</Typography>
              <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              height={"50vh"}
              overflow={"auto"}
            >
              {
                isLoadingRemoveMember ? <CircularProgress/>:(
                  
               
                members.map((i)=>(
                  <UserItem
                  user={i}
                  key={i._id}
                  isAdded
                  styling={{
                    boxShadow: "0 0 0.5rem  rgba(0,0,0,0.2)",
                    padding: "1rem 2rem",
                    borderRadius: "1rem",
                  }}
                  handler={removeMemberHandler}
                />
                ))
               
             
                )
              }
              
               </Stack>
{/* //Buttongroup */}
              <Stack direction={{sm:"row" , xs:"column-reverse"}}
              spacing={"1rem"}
              p={{sm:"1rem",xs:"0" , md:"1rem 4rem"}}
              >
                <Button size="large" color='error' startIcon={<Delete/>} onClick={OpenconfirmDeleteHandler}>Delete Group</Button>
                <Button size="large" variant='contained' startIcon={<Add/>} onClick={openAddMemberHandler}>Add members</Button>
              </Stack>
              </>
            }
            </Grid>

  {
    isAddMember && <Suspense><AddMemberDialog chatId={chatId}/></Suspense>
  }

   {
    confirmDeleteDialog && <Suspense fallback={<Backdrop open/>}>
      <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={CloseConfirmDeleteHandler}
      deleteHandler={deleteHandler}
      ></ConfirmDeleteDialog>
    </Suspense>
   }
          <Drawer sx={{display:{xs:"block" ,sm:"none"}}} open={isMobileMenuOpen} onClose={handleMobileClose} >
          <GroupsList chatId={chatId} myGroups={myGroups.data.transformedGroups} w={"10vw"}/>
          </Drawer>
   </Grid>

  )
}



const GroupsList = ({w="100vw",myGroups=[],chatId})=>{
return(
<Stack  width={w}
    sx={{
      height: "100vh",
      overflow: "auto",
    }}>
    {
      myGroups.length>0? (myGroups.map((group)=>{
       return  <GroupListItem group={group} chatId={chatId} key={group._id}/>}))
      :
      (<Typography variant='text'>No groups</Typography>)
    }
</Stack>
)
}


const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <LinkComponent sx={{
      "&:hover":{width:"inherit"}
    }}
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
      
    </LinkComponent>
  );
});
export default Group


// <LinkComponent
//       sx={{
//         padding: "0",
//       }}
//       to={`/chats/${_id}`}
//       onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
//     >
      
//         <AvatarCard avatar={avatar} />

//         <Stack>
//           <Typography>{FriendName}</Typography>
//           {newMessageAlert && (
//             <Typography sx={{fontSize:"0.7rem",color:"gray"}}>{newMessageAlert.count} New Message</Typography>
//           )}
//         </Stack>

//         {isOnline && (
//           <Box
//             sx={{
              
//               width: "10px",
//               height: "10px",
//               borderRadius: "50%",
//               backgroundColor: "green",
//               position: "absolute",
//               top: "50%",
//               right: "1rem",
//               transform: "translateY(-50%)",
//             }}
//           />
//         )}
//       </motion.div>
//     </LinkComponent>