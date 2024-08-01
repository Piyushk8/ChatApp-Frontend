import React from 'react'
import { Grid ,Skeleton , Stack, Typography} from '@mui/material'
import { BouncingSkeleton } from '../StyledComponent'
const Layoutloader = () => {
  return (
    <>
     <Grid container height={"calc(100vh-4rem)"} spacing={"1rem"}> 
          <Grid item sm={4} md={3} sx={{display:{xs:"none" , sm:"block"}}}><Skeleton variant='rectangular' height={"100vh"}/></Grid>
          <Grid item xs={12} sm={8}  md={5} lg={6}  >
          <Stack spacing="1rem">{
            Array.from({length:10}).map((_,index)=>(
                <Skeleton key={index} variant='rectangular' height={"5rem"} />
            ))
          }</Stack>
          </Grid>
          <Grid item md={4} lg={3} sx={{display:{xs:"none",md:"block"} ,
            
             }}><Skeleton variant='rectangular' height={"100vh"}/> </Grid>
        </Grid>

    </>
  )
}

export const TypingLoader = ()=>{
  return (
    <Stack spacing={"0.5rem"}
    direction={"row"} 
    padding={"0.5rem"} 
    justifyContent={"center"}
    >
      <BouncingSkeleton style={{animationDelay:"0.1s"}} variant='circular' width={15} height={15}/>
      <BouncingSkeleton style={{animationDelay:"0.2s"}} variant='circular' width={15} height={15}/>
      <BouncingSkeleton variant='circular' width={15} style={{animationDelay:"0.3s"}} height={15}/>
      <BouncingSkeleton variant='circular' width={15} height={15} style={{animationDelay:"0.4s"}}/>
      
    </Stack>
  )
}

export default Layoutloader
