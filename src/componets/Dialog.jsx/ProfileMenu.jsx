import {  Typography,Divider,Avatar, IconButton, Drawer, Box, Stack, styled, TextField } from '@mui/material'
import React,{useState} from 'react'
import { useSelector } from 'react-redux'
import { setIsEditName, setIsProfile } from '../../redux/reducer/misc'
import { ArrowBack, Check, Edit,  LogoutSharp, Settings } from '@mui/icons-material'
import { transformImage } from '../../lib/features'
import moment from 'moment'

const BoxWrapper = styled(Box)`
background:;
padding: 12px 30px 2px;
& :first-child {
    font-size: 13px;
    color: #009688;
    font-weight: 200;
};
& :last-child {
    margin: 14px 0;
    color: #4A4A4A;
}`
const ProfileMenu = ({isProfile,dispatch,profileAnchor,LogoutHandler}) => {
  const {user} = useSelector((state)=>state.auth)
  const {isEditName} = useSelector((state)=>state.misc)
  const [newName, setnewName] = useState("")
  const handleClose =()=>{
    dispatch(setIsProfile(false))
  }
  // const handleLogout=()=>{

  // }
  const handleEditName = ()=>{
    dispatch(setIsEditName(false))
    console.log(newName

    )
  }


  
  const ProfileCard = ({ text, heading }) => {
    return(
        <BoxWrapper>
           <Typography color={"green"} variant="body1">
            {heading}
          </Typography>
          {text==="" ? 
            <TextField sx={{color:'black'}} placeholder='Name..'
            value={newName}
            onChange={(e)=>setnewName(e.target.value)}
            ></TextField>:
          
          <Typography variant="body1"color={"grey"}>{text}</Typography>}
         
          </BoxWrapper> 
          )
    };

  return (
    <Drawer
    anchor='right'
    open={isProfile}
    onClose={handleClose}
    style={{ zIndex: 1500 }}
    PaperProps={{
      sx: {
        WebkitOverflowScrolling:"none",
        right: 5,
        top: 20,
        height: "90vh", // Adjust height based on viewport height
        width: { xs: "95%", sm:"85%", md: "35%", lg: "30%" },
        background: "lightgrey",
        borderRadius: "8px", 
        display: 'flex',  
        flexDirection: 'column',  
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: '13%',
        bgcolor: "#215C54",
        padding: "0 16px",
      }}
    >
      <IconButton onClick={handleClose}>
        <ArrowBack fontSize='medium' sx={{ color: "white" }} />
      </IconButton>
      <Typography
        sx={{
          color: "white",
          fontSize: "1.5rem",
          ml: "2rem",
        }}
      >
        Profile
      </Typography>
    </Box>
  
    <Stack sx={{ flex: 1, overflowY: 'auto', padding: '1rem' ,height:"80%"}}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Avatar
          src={transformImage(user?.avatar?.url)}
          sx={{
            marginTop: "1rem",
            width: { xs: 90, sm: 120, md: 140 },
            height: { xs: 90, sm: 120, md: 140 },
            objectFit: "contain",
            marginBottom: "1rem",
          }}
        />
      </Box>
  
      <Box
        sx={{
          display: "flex",
          gap: "0.2rem",
          flexDirection: 'column',
          bgcolor: 'whitesmoke',
          padding: "16px", 
        }}
      >
        <ProfileCard
          heading={"Username"}
          text={user?.username}
        />
        <Divider sx={{ width: "40%", alignSelf: "center" }} />
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems="center"
        >
         {
          isEditName ? <> 
          <ProfileCard heading={"Name"} text={""}/>
          <IconButton
            sx={{}} 
            onClick={handleEditName}
          >
          <Check/>
          </IconButton>
          </> :
          <>
          <ProfileCard heading={"Name"} text={user?.name} />
          <IconButton onClick={()=>dispatch(setIsEditName(true))}>
            <Edit  fontSize='small' sx={{ color: "grey" }} />
          </IconButton>
          </>
         }
        </Stack>
        
        <ProfileCard
          heading={"Joined"}
          text={moment(user?.createdAt).fromNow()}
        />
      </Box>
  
      {/* Logout and Settings Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          ml: '2rem',
          mt: "1.5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            transition: "background-color 0.3s",
            '&:hover': {
              bgcolor: "rgba(33, 92, 84, 0.1)",
            },
            padding: "8px 12px",
            borderRadius: "4px",
          }}
          onClick={LogoutHandler} 
        >
          <LogoutSharp fontSize='medium' sx={{ color: "grey" }} />
          <Typography sx={{ ml: "1rem", fontSize: "1rem" }}>Logout</Typography>
        </Box>
        <Box
          sx={{
            mb: "1rem",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            transition: "background-color 0.3s",
            '&:hover': {
              bgcolor: "rgba(33, 92, 84, 0.1)",
            },
            padding: "8px 12px",
            borderRadius: "4px",
          }}
          onClick={()=>{}} //! Add  settings function here
        >
          <Settings fontSize='medium' sx={{ color: "grey" }} />
          <Typography sx={{ ml: "1rem", fontSize: "1rem" }}>Settings</Typography>
        </Box>
      </Box>
    </Stack>
  </Drawer>
  
    )
  }
  
  

export default ProfileMenu
