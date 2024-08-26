import { Avatar, AvatarGroup, Stack ,Box} from '@mui/material'
import React from 'react'
import {transformImage} from "../../lib/features"
import userAvatar from "../../assets/userAvatar.webp"
const AvatarCard = ({avatar=[] ,isOnline, max=4}) => {
 
  return (
   <Stack
    direction={"row"}
    spacing={0.5}
    paddingLeft={"10px"}
   >
    <AvatarGroup position="relative" max={max}>
        <Box  height={"3rem"} sx={{width:{"md":"5rem","xs":"3rem"}}} >
            {
                avatar.map((i , index) => {
                   return <Avatar src={i?.avatar?.url || i?.url||i || {userAvatar}}
                        key={Math.random()*1000}
                        alt={`Avatar${index}`}
                        sx={{  
                            border: isOnline ? '12px solid green' : '2px solid gray', // Conditional border color
                            }}
                        style={{
                           
                           // avatarStyle,
                            background:"grey",
                             width:{xs:"2rem",md:"3rem"},
                             height:{xs:"2rem",md:"3rem"},
                             position:"absolute",
                             left:{
                                xs:`${index+0.5}rem`
                                ,sm:`${index+5}rem`
                             }  
                        }}

                    ><Box></Box> </Avatar>

                })
            }
        </Box>

    </AvatarGroup>

   </Stack>
  )
}

export default AvatarCard
