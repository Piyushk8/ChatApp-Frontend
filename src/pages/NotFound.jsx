import { Error } from '@mui/icons-material'
import { Icon, Stack, Typography } from '@mui/material'
import React from 'react'

function NotFound() {
  return (
    <Stack direction={"row"} spacing={"2rem"}>
      <Icon sx={{fontSize:"5rem"}}>
      <Error />
      </Icon>
   <Typography sx={{
    color:"black",
    fontSize:"5rem"

   }}>
    404 Not FOUND
   </Typography>
   </Stack>
  )
}

export default NotFound
