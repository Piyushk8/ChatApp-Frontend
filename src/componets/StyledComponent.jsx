import { keyframes, Skeleton, styled } from "@mui/material";
import { animate, animations } from "framer-motion";
import { Link } from "react-router-dom";
export const VisuallyHiddenInput = styled("input")
({
    border:0,
    clip:"rect( 0 0 0 0)",
    height:1,
    margin:-1,
    overflow:"hidden",
    padding:0,
    position:"absolute", 
    whiteSpace:"nowrap",
    width:1
})

export const LinkComponent = styled(Link)`
text-decoration:none;
color:black;
&:hover{
background-color:#f0f0f0}
}
`


export const InputBox = styled("input")`
width: 90%;
height: 80%;
border:none;
padding: 1rem ;
border-radius : 0.5;
background-color: ${"white"};
label:Text;
}
`
const BouncingAnimation = keyframes`
    0% { transform:scale(1); }
    50% { transform:scale(1.5) }
    100% { transform:scale(1) }
  
`
export const BouncingSkeleton = styled(Skeleton)(()=>{
    animation:`${BouncingAnimation} is infinite`
})