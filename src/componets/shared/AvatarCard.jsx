import { Avatar, AvatarGroup, Stack ,Box} from '@mui/material'
import React from 'react'
import {transformImage} from "../../lib/features"
import userAvatar from "../../assets/userAvatar.webp"
const AvatarCard = ({avatar=[] , max=4}) => {
    
  return (
   <Stack
    direction={"row"}
    spacing={0.5}
   >
    <AvatarGroup position="relative" max={max}>
        <Box width={"5rem"} height={"3rem"}>
            {
                avatar.map((i , index) => {
                   return <Avatar src={i?.avatar?.url || i?.url||i || {userAvatar}}
                        key={Math.random()*1000}
                        alt={`Avatar${index}`}
                        style={{
                            background:"grey",
                             width:{xs:"2rem",md:"3rem"},
                             height:{xs:"2rem",md:"3rem"},
                             position:"absolute",
                             left:{
                                xs:`${index+0.5}rem`
                                ,sm:`${index+5}rem`
                             }  
                        }}

                    ></Avatar>

                })
            }
        </Box>

    </AvatarGroup>

   </Stack>
  )
}

export default AvatarCard
