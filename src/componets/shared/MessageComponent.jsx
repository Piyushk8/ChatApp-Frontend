import { Box, Typography } from '@mui/material'
import moment from 'moment'
import React from 'react'
import { fileFormat } from '../../lib/features'
import RenderContent from './RenderContent'
import { useSelector } from 'react-redux'

const MessageComponent = ({user,message }) => {
  const {sender,content , attachments=[],createdAt} = message
  const sameSender = sender?._id === user?._id
    const  timeAgo = moment(createdAt).fromNow();
 
  return (
    <div style={{
        alignSelf:sameSender? "flex-end":"flex-start",
        backgroundColor:sameSender? "#aaaaaa":"	#bbbbbb",
        color:"black",
        borderRadius:"0 10px 0 10px" ,
        padding:"0.5rem"
        ,width:"fit-content",
        
    }}>
    {
        !sameSender && <Typography color={"#2694ab"} fontWeight={"600"} 
        variant='caption'>
        {sender.name}
        </Typography>
       


    }
    {
        content && <Typography>{content} </Typography>
    }
    {
        attachments.length>0  && attachments.map((attachment,index)=>{
        const url = attachment.url;
        const file =fileFormat(url);
        // console.log(RenderContent(url,file));
    return ( <Box key={index}>
    <a href='' target='_blank' download  style={{color:"black"}} >
        {RenderContent({url,file})}
    </a> 
        </Box>);

 
    })
}
{
    <Typography  variant="caption " color={"text.secondary"} fontSize={"0.5rem"}>{timeAgo}</Typography>
}
    </div>
  )
}

export default MessageComponent
