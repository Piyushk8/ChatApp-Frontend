import {useState} from 'react'
import {Button, Container, Paper, TextField, Typography, Stack, Avatar, IconButton} from "@mui/material"
import {CameraAlt as CameraAltIcon} from "@mui/icons-material"
import { VisuallyHiddenInput } from '../componets/StyledComponent';
import {useFileHandler, useInputValidation, useStrongPassword} from "6pp"
import { usernameValidator } from '../utils/Validators';
import axios from 'axios';
import { server } from '../constant/config';
import { useDispatch , useSelector} from 'react-redux';
import { userExists } from '../redux/reducer/auth';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate("/")
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async(e)=>{
     
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
            username: username.value,
            password: password.value,
          },
          config
        );
        dispatch(userExists(data.user));
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
    const handleSignUp = (e)=>{
        e.preventDefault();

        const formData = new FormData();
  formData.append("avatar", avatar.file);
  formData.append("name", name.value);
  formData.append("bio", bio.value);
  formData.append("username", username.value);
  formData.append("password", password.value);

  axios.post(`${server}/api/v1/user/signup`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data" // Ensure the Content-Type is set correctly for FormData
    }
  }).then((res)=>toast.success(res.data.message))
    .catch((err)=>toast.error(err.response.data.message))
    }


 
  const toggleisLogin = ()=>{
    setIsLogin((prev) => !prev)
  }
  const name = useInputValidation();
  const bio = useInputValidation("" ,);
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword();
  const avatar = useFileHandler("single" )

  return (
    <Container sx={{
      height:"100vh",
      display:"flex",
      alignItems:"center",
      justifyContent:"center"
    }} component={"main"} maxWidth="xs"
      
      >
      <Paper
          elevation={3}
          sx={
            {
              padding:4,
              display:"flex",
              flexDirection:"column",
              alignItems:"center"
            }
          }
          >
       {isLogin ? (<>
       {/* LoginForm */}

       <Typography variant='h5'> 
            Login </Typography>

        <form style={{
              width:"100%",
              marginTop:"1rem "
            }} onSubmit={handleLogin}>

          <Stack position={"relative"}
            width={"10rem"}
            margin={"auto"}

          >
              <Avatar sx={
                {width:"10rem",
                height:"10rem"
                ,objectFit:"contain"
                }
              }/>
            <IconButton sx={{
              position:"absolute",
              bottom:"0",
              right:"0",
              bgcolor:"rgba(255,255,255,0.5)",hover:{bgcolor:"rgba(255,255,255,0.7)"}
            }} component="label"
            src={avatar.preview}
            >
              <>
              <CameraAltIcon/>
              <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}/>
              </>
            </IconButton>
          </Stack>
          
          <TextField 
          required 
          fullWidth 
          value={username.value}
          onChange={username.changeHandler}
          label="username" 
          margin='normal' 
          variant='outlined'/>
          {
            username.error && (<Typography color="error" variant='caption' >
              {username.error}
            </Typography>)
          }

          <TextField
           value={password.value}
           onChange={password.changeHandler}
          required
          fullWidth
          label="password"
          margin='normal'
          />
          {
            password.error && (<Typography color="error" variant='caption' >
              {password.error}
            </Typography>)
          }
          <Button variant='contained'
          color='primary'
          type='submit'
          fullWidth
          >
            Sign-in
          </Button>

          <Typography textAlign={"center"} m={"1rem"}>Or</Typography>
         <Button 
            fullWidth
            variant='text' 
            sx={{marginTop:"1rem"}}
            onClick={toggleisLogin  }>Register</Button>
            
          
         </form>
       </>) :  <>
              <Typography variant="h5">Sign Up</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
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
                  <Typography
                    m={"1rem auto"}
                    width={"fit-content"}
                    display={"block"}
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  // disabled={isLoading}
                >
                  Sign Up
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>

                <Button
                  // disabled={isLoading}
                  fullWidth
                  variant="text"
                  onClick={toggleisLogin}
                >
                  Login Instead
                </Button>
              </form>
            </>}
      </Paper>

    </Container>
  )
}

export default Login
