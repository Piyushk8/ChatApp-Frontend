import React from 'react'
import AppLayout from '../componets/Layout/AppLayout'
import { Typography ,Box ,Container, Divider} from '@mui/material';
import { emptyChatImage } from '../constant/color';

function Home() {
  
  return (
  // <Box 
  //   sx={{
  //     padding: 4,
  //     backgroundColor: 'gray',
  //     boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // overshadowed background
  //     borderRadius: 2,
  // }}
  // bgcolor={"gray"} height={"100vh"}>
  //   <Typography color={"Black"} fontSize={{xs:"2rem" , md:"3rem"}} p={{xs:"2rem"}} textAlign={"center"} sx={{
  //                   fontFamily: 'Outfit, sans-serif',
  //                   opacity: 0.7, // faded text
  //               }} >
  //     Select a friend to chat
  //   </Typography></Box>
  
  <Container
  maxWidth="lg" 
  sx={{
    backgroundColor:"white",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '100vh',
  }}
>
  <Box
    component="img"
    src={emptyChatImage}
    alt="empty"
    sx={{
      
      width: '100%',
      mb: 3, // Margin bottom
    }}
  />
  <Typography variant="h4" gutterBottom>
  ChatApp Web
  </Typography>
  <Typography variant="body1" color="textSecondary" gutterBottom>
    Now send and receive messages 
  </Typography>
 
  <Divider sx={{ width: '100%', mt: 3 }} />
</Container>
  )
}

export default AppLayout()(Home); 
