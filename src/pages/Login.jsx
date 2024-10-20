import {useState} from 'react'
import {Button, Container, Paper, TextField, Typography, Stack, Avatar, IconButton, ButtonGroup, Box, Grid, Divider, styled} from "@mui/material"
import {CameraAlt as CameraAltIcon} from "@mui/icons-material"
import { VisuallyHiddenInput } from '../componets/StyledComponent';
import {useFileHandler, useInputValidation, useStrongPassword} from "6pp"

import axios from 'axios';
import { server } from '../constant/config';
import { useDispatch , useSelector} from 'react-redux';
import { setIsAuthenticated, userExists } from '../redux/reducer/auth';
import toast from 'react-hot-toast'
import {useForm} from "react-hook-form"
import { Link, useNavigate } from 'react-router-dom'
// import {z} from "zod";

import signupImage from "../assets/signupImage.webp"
const fontFamily = "belleza"; // Change to your desired font

const StyledTypography = styled(Typography)({
  fontFamily: fontFamily,
  // Add more styles here if needed
});

const StyledTextField = styled(TextField)({
  fontFamily: fontFamily,
  // Add more styles here if needed
  '& .MuiInputBase-input': {
    fontFamily: fontFamily,
  },
});


function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate("/")
  const {isAuthenticated} = useSelector((state)=>state.auth)
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors,isSubmitting:loginIsSubmitting }
  } = useForm({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors ,isSubmitting:signupIsSubmitting}
  } = useForm({
    defaultValues: {
      name: '',
      username: '',
      bio: '',
      password: '',
    }
  });

  const [typeOfPassword, settypeOfPassword] = useState("password")
  const handleLogin = async(formData)=>{
      
      const toastId = toast.loading("Logging In...");

      setIsLoading(true);
      const config = {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      try {
        const { data } = await axios.post(
          `${server}/api/v1/user/login`,
          {
            username:formData?.username,
            password:formData?.password,
          },
          config
        );
        // if(data?.success === true){
        dispatch(userExists(data.user));
        dispatch(setIsAuthenticated(true))
        toast.success(data.message, {
          id: toastId,
        });
        nav("/")
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something Went Wrong", {
          id: toastId,
        });
      } finally {
        setIsLoading(false);
      }
    };
    const handleSignUp = (signupFormData)=>{
        if(!avatar.file){
          toast.error("Please add an Avatar")
          return
        }
        const formData = new FormData();
        formData.append("avatar", avatar.file);
        formData.append("name",signupFormData.name);
        formData.append("bio",signupFormData.bio);
        formData.append("username",signupFormData.username);
        formData.append("password",signupFormData.password);

        
        axios.post(`${server}/api/v1/user/signup`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data" 
          }
        }).then((res)=>{
          toast.success(res.data.message)
          dispatch(userExists(data.user));
          dispatch(setIsAuthenticated(true))
          nav("/")
        })
          .catch((err)=>toast.error(err.response.data.message))
          }


 
  const toggleisLogin = ()=>{
    setIsLogin((prev)=>!prev)
  }
  // const name = useInputValidation();
  // const bio = useInputValidation("" ,);
  // const username = useInputValidation("", usernameValidator);
  // const password = useStrongPassword();
  const avatar = useFileHandler("single" )

  return (
   
<Container sx={{
  maxWidth:{xs:"sm",md:"md"},
  bgcolor:'white',
  height:"100vh",
  display:"flex",
  alignItems:"center",
  justifyContent:"center"
}} component={"main"} 
  
  >
  <Paper
      elevation={10}
      
      sx={
        {flexGrow:1,
          padding:4,
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          maxWidth:"80vw",
          maxHeight:"100vh"
        }
      }
      
      >
        <Grid 
        container
        maxWidth={"80vw"}
        sx={{
        height:"85vh"
        }}>
          <Grid item
          sx={{
            //height:'80vh',
            display:{xs:"none",md:"block"},
          }}
          md={6}
          >
            <Box
              sx={{
                borderRight:"1px solid lightgrey",
                bgcolor:"black",
                height: "100%",
                width: "100%",
                pl:"1rem",
                backgroundSize: "cover", // Scale the image to cover the box
                backgroundPosition: "center", // Center the image in the box
                backgroundRepeat: "no-repeat", // Prevent the image from repeating
                backgroundImage:`url(${signupImage})`
              }}
            >              
            
            </Box>
           
          </Grid>

     {/*     forms */}
          <Grid item
            sx={{bgcolor:'',
              display:'flex',
              flexDirection:'row',
              justifyContent:"center"
              ,overflowY:'auto',
              '&::-webkit-scrollbar': {
                width: '0px',},
             }}
            height={"100%"}
            xs={12} md={6}
           
          > 
          {isLogin ?
           
            <Stack
            direction={"column"}
              height={"100%"}
              bgcolor={""}
              spacing={"1rem"}
              paddingTop={"1rem"}
              sx={{width:{xs:"100%",sm:"70%"}}}
              >
                <Typography 
                  color={"green"}
                  textAlign={"center"}
                variant='H1'
                fontFamily={"Belleza"}
                 fontSize={"1.5rem"}
                 fontWeight={'900'}
                >ChatterBox</Typography>    
                <Typography
                    sx={{
                      fontFamily:'belleza',
                      textAlign: "center"
                     , paddingBottom:"1rem",
                     pt:"2rem",
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color:"grey"
                    }}
                  >
                    Welcome! to ChatterBox
                  </Typography>

                  
                  <Box
                    sx={{
                      display:"flex",
                      flexDirection:'column',
                      // marginY:'2rem', 
                      //alignItems:"center",
                      //width:{xs:"100%",sm:"75%",md:"70%"}
                    }}
                    
                      
                  >
                  
                    <Box sx={{
                      marginTop:"1rem"
                      }}>
                      <StyledTypography
                      sx={{marginBottom:"5px",
                        fontSize:'11px',
                        fontWeight:'600',
                        color:'grey',
                        width:"100%",
                        
                      }}
                      >Users Name</StyledTypography>
                      <StyledTextField 
                        required
                        {
                          ...registerLogin('username',{
                            required:"Username required!"})
                        }
                        // value={username.value}
                        // onChange={username.changeHandler}
                        placeholder='Piyushk@12345'
                        variant='standard'
                        sx={{
                          
                          "& .MuiInput-underline:before": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                            borderBottom: "none",
                          },
                          width: "100%",  // Ensures the TextField is full width
                          }}
                      />
                    </Box>
                    <Box sx={{color:"red",
                      fontSize:'0.6rem'}}>{loginErrors?.username?.message}</Box>
                    <Divider sx={{width:"100%"}}/>
                  
                  
                    <Box sx={{marginTop:"2rem"}}>
                      <StyledTypography
                        sx={{marginBottom:"5px",
                          fontSize:'11px',
                          fontWeight:'600',
                          color:'grey'
                        }}
                        >Password</StyledTypography>
                      <StyledTextField
                        required
                        {
                          ...registerLogin('password',{
                            required:"Password Required!",
                            minLength:{value:6,message:"Password Must be atleast 6 characters"}
                          })
                        }
                        // value={password.value}
                        // onChange={password.changeHandler}
                        type={typeOfPassword} 
                        placeholder='12345'
                        variant='standard'
                        sx={{ 
                          "& .MuiInput-underline:before": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                            borderBottom: "none",
                          },
                          width: "100%",  // Ensures the TextField is full width
                        }}
                      >

                    </StyledTextField>
                    </Box>
                    <Box sx={{fontSize:"0.6rem",color:"red"}}>{loginErrors?.password?.message}</Box>
                  <Divider sx={{width:"100%"}}/>
                
                  </Box>


                  <StyledTypography
                  
                  sx={{
                    alignSelf:'end',
                    fontSize:"0.6rem",
                    fontWeight:"600",
                    color:"darkgray",
                    marginRight:'5rem'
                  }}
                  >Forgot Password?</StyledTypography>

                  <Button 
                    tabIndex={0}
                    disabled={loginIsSubmitting}
                    variant={"contained"}
                    onClick={handleSubmitLogin(handleLogin)}
                    sx={{
                      alignSelf:"center",
                      bgcolor:'darkgreen',
                      "&:hover":{bgcolor:"green"},
                      "&:focus": {
                                    bgColor: "green",
                                  },
                      width:"10rem", 
                      borderRadius:'1rem'
                    }}>
                    Sign in
                  </Button>
                
                  <Divider sx={{
                    fontSize:'10px',
                    paddingTop:"2rem",
                    color:"grey",
                    width:'70%',alignSelf:'center'
                  }}>or</Divider>
                  
                  <StyledTypography
                    onClick={()=>setIsLogin(false)}
                    sx={{
                      color:"grey",
                      alignSelf:'center',
                      marginTop:'1rem',
                      fontSize:"0.8rem" 
                    }}>New User? <StyledTypography sx={{tabIndex:1, cursor:'pointer',display:"inline",color:'green'}}>Sign up</StyledTypography></StyledTypography>
            </Stack>
            
//!Signup form     
              :

            <Stack
              direction={"column"}
              height={"100%"}
              bgcolor={""}
              spacing={"1rem"}
              sx={{
              // overflowY:"auto",
              width:{xs:"100%",sm:"70%"}}}
              >
                    
              <Typography 
                color={"green"}
                textAlign={"center"}
                variant='H1'
                fontFamily={"Belleza"}
                fontSize={"1.5rem"}
                fontWeight={'900'}
                >ChatterBox</Typography>    
                <Typography
                    sx={{
                      fontFamily:'belleza',
                      textAlign: "center",
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color:"grey"
                    }}
                  >
                    Welcome! to ChatterBox
                  </Typography>

                  <Stack 
                    position={"relative"} 
                    width={"5rem"} 
                    margin={"auto"}
                    alignSelf={"center"}>
                    <Avatar
                      sx={{
                        width: "3rem",
                        height: "3rem",
                        objectFit: "contain",
                      }}
                      src={avatar.preview}
                  />

                  <IconButton
                    sx={{height:"6px",
                      width:'6px',
                      position: "absolute",
                      bottom: "0",
                      right: "2",
                      color: "lightgrey",
                      bgcolor: "rgba(0,0,0,0.3)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>

                {avatar.error && (
                  <StyledTypography
                    m={"1rem auto"}
                    width={"fit-content"}
                    display={"block"}
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </StyledTypography>
                )}
                  <Box
                    sx={{
                      display:"flex",
                      flexDirection:'column',
                      // marginY:'2rem', 
                      //alignItems:"center",
                      //width:{xs:"100%",sm:"75%",md:"70%"}
                    }}
                  >
                    <Box sx={{
                      marginTop:"1rem"
                      }}>
                      <StyledTypography
                      sx={{marginBottom:"5px",
                        fontSize:'11px',
                        fontWeight:'600',
                        color:'grey',
                        width:"100%"
                      }}
                      >Name</StyledTypography>
                      <StyledTextField 
                        {
                          ...registerSignup('name',{
                            required:"name required!"})
                        }
                        placeholder='Jane doe'
                        label=""
                        variant='standard'
                        sx={{
                          
                          "& .MuiInput-underline:before": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                            borderBottom: "none",
                          },
                          width: "100%",  // Ensures the TextField is full width
                          }}
                      />
                    </Box>
                    <Box sx={{color:"red",
                      fontSize:'0.6rem'}}>{signupErrors?.name?.message}</Box>
                    
                    <Divider sx={{width:"100%"}}/> <Box sx={{
                      marginTop:"1rem"
                      }}>
                      <StyledTypography
                      // value={username.value}
                      // onChange={username.changeHandler}
                      sx={{marginBottom:"5px",
                        fontSize:'11px',
                        fontWeight:'600',
                        color:'grey',
                        width:"100%"
                      }}
                      >Users Name</StyledTypography>
                      <StyledTextField
                         {
                          ...registerSignup('username',{
                            required:"Username required!"})
                        }
                        placeholder='Jane@doe'
                        label=""
                        variant='standard'
                        sx={{
                          
                          "& .MuiInput-underline:before": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                            borderBottom: "none",
                          },
                          width: "100%",  // Ensures the TextField is full width
                          }}
                      />
                    </Box>
                    <Box sx={{color:"red",fontSize:"0.6rem"}}>{signupErrors?.username?.message}</Box>
                    <Divider sx={{width:"100%"}}/>
                    <Box sx={{
                      marginTop:"1rem"
                      }}>
                      <StyledTypography
                        sx={{marginBottom:"5px",
                          fontSize:'11px',
                          fontWeight:'600',
                          color:'grey',
                          width:"100%"
                        }}
                        >Bio</StyledTypography>
                      <StyledTextField 
                        required
                        // value={bio.value}
                        // onChange={bio.changeHandler}
                        {
                          ...registerSignup('bio',{
                            required:"Bio required!"})
                        }
                        placeholder='About you...'
                        label=""
                        variant='standard'
                        sx={{
                          
                          "& .MuiInput-underline:before": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                            borderBottom: "none",
                          },
                          width: "100%",  // Ensures the TextField is full width
                          }}
                      />
                    </Box>
                    <Box sx={{color:"red",fontSize:"0.6rem"}}>{signupErrors?.bio?.message}</Box>
                    
                    <Divider sx={{width:"100%",marginBottom:'1rem'}}/>
                  
                    
                      <StyledTypography
                        sx={{
                          fontSize:'11px',
                          fontWeight:'600',
                          color:'grey'
                        }}
                        >Password</StyledTypography>
                      <StyledTextField
                        // required
                        // value={password.value}
                        // onChange={password.changeHandler}
                        {
                          ...registerSignup('password',{
                            required:"password required!",
                            minLength:{value:6,message:"Password Must be atleast 6 characters"}
                          })
                        }
                        type={typeOfPassword} 
                        placeholder='Abcd@123'
                        title='password'
                        variant='standard'
                        sx={{ 
                          "& .MuiInput-underline:before": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "none",
                          },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                            borderBottom: "none",
                          },
                          width: "100%",  // Ensures the TextField is full width
                        }}
                      />

                <Box sx={{color:"red",fontSize:"0.6rem"}}>{signupErrors?.password?.message}</Box>
                    
                  
                  <Divider sx={{width:"100%"}}/>
                  
                  </Box>


                  <StyledTypography
                  sx={{
                    alignSelf:'end',
                    fontSize:"0.6rem",
                    fontWeight:"600",
                    color:"darkgray",
                    marginRight:'5rem'
                  }}
                  >Forgot Password?</StyledTypography>

                  <Button 
                  disabled={signupIsSubmitting}
                  tabIndex={0}
                    variant={"contained"}
                    onClick={handleSubmitSignup(handleSignUp)}
                    sx={{
                      "&:hover":{bgcolor:"green"},
                      "&:focus": {
                                    bgColor: "green",
                                  },
                      alignSelf:"center",
                      bgcolor:'darkgreen',
                      width:"10rem", 
                      borderRadius:'10px'
                    }}>
                    Sign up
                  </Button>
                
                  <Divider sx={{
                    fontSize:'10px',
                    color:"grey",
                    width:'70%',alignSelf:'center'
                  }}>or</Divider>
                  
                  <StyledTypography
                    onClick={()=>setIsLogin(true)}
                    sx={{
                      color:"",
                      alignSelf:'center',
                      fontSize:"0.8rem" 
                    }}>Already User? <StyledTypography sx={{display:'inline',color:'green'}}>Sign in</StyledTypography></StyledTypography>
            </Stack>
      
          }
          </Grid>
        </Grid>



  </Paper>

</Container>
  )
}

export default Login





