import React from 'react'
import { transformImage } from '../../lib/features';
import { FileOpen } from '@mui/icons-material';

const RenderContent = ({file,url}) => {
  
    switch (file){
        case "video":
            return <video preload='none' width={"200px"} controls src={url}/>
            
        case "image":
            return ( <img 
                width={"200px"}
                height={"150px"}
                style={{objectFit:"contain"}}
                src={transformImage(url)} alt='atatchemnt'></img>
            );
        case "audio":
            return <audio src={url} preload='none' controls></audio>           
            
    default:
    return<FileOpen></FileOpen>
        }

 
}

export default RenderContent
