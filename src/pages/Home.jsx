import React from 'react'
import AppLayout from '../componets/Layout/AppLayout'
import { Typography ,Box } from '@mui/material';

function Home() {
  
  return (<Box 
    sx={{
      padding: 4,
      backgroundColor: 'gray',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // overshadowed background
      borderRadius: 2,
  }}
  bgcolor={"gray"} height={"100vh"}>
    <Typography color={"Black"} fontSize={{xs:"2rem" , md:"3rem"}} p={{xs:"2rem"}} textAlign={"center"} sx={{
                    fontFamily: 'Outfit, sans-serif',
                    opacity: 0.7, // faded text
                }} >
      Select a friend to chat
    </Typography></Box>
  )
}

export default AppLayout()(Home); 
