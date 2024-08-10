import { useInputValidation } from "6pp";
import { Box, CircularProgress, Dialog, DialogTitle, InputAdornment, Stack, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from "@mui/icons-material/";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducer/misc";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
import { useAsyncMutation } from "../../hooks/hook.jsx";

const SearchD = () => {

  const dispatch = useDispatch();
  const { isSearch } = useSelector((state) => state.misc);

  const [sendFriendRequest, isLoadingFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);
  const [searchUser, isLoading] = useLazySearchUserQuery();
  const [isskeleton, setIsSkeleton] = useState(true);

  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
  }

  const addFriendHandler = async (id) => {
    await sendFriendRequest("sending Friend Request", { ReceiverId: id });
  }

  const [users, setUsers] = useState([]);
  const search = useInputValidation("");
  const isLoadingSendFriend = false;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => {
          setIsSkeleton(false);
          setUsers(data.Users);
        })    // Debouncing
        .catch((e) => console.log(e))
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    }
  }, [search.value]);

  return (
    <Dialog
    open={isSearch}
    onClose={searchCloseHandler}
    sx={{
      
      
      '& .MuiDialog-paper': {
        //backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        borderRadius: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        backdropFilter:"none",
        padding: {md:"1rem"},
        width:{xs:"85%%" ,sm:"50%"},
        height:{xs:"70%" ,sm:"80%"},
      },
    }}
  >
    <DialogTitle
      sx={{
        textAlign: 'center',
        fontSize: '1.5rem',
        borderBottom: '1px solid #ddd',
        paddingBottom: '0.5rem',
        bgcolor: 'transparent',
      }}
    >
      Find people
    </DialogTitle>
    <TextField
      label=""
      value={search.value}
      onChange={search.changeHandler}
      variant="outlined"
      size="small"
      placeholder="Search user..."
      sx={{
        fontFamily:"sans-serif",
        width: '70%',
        alignSelf: 'center',
        border: '1px solid #ddd',
        borderRadius: '4px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px',
          '& fieldset': {
            borderColor: '#ddd',
          },
          '&:hover fieldset': {
            borderColor: '#388e3c',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#388e3c',
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
    <Stack
      sx={{
        width:"100%",
        
        overflowY: 'auto',
        // p: 2,
        borderTop: '1px solid #ddd',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f5f5f5',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#388e3c',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#2c6e3d',
        },
        maxHeight:"28rem",
        // height:"28rem"
      }}
      direction="column"
      
      
    >
      {isskeleton ? (
        <Box alignSelf="center" marginTop="2rem" sx={{ display: 'flex' }}>
          <CircularProgress sx={{ color: 'darkgreen' }} />
        </Box>
      ) : (
        <Stack>
          {users.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              avatar={user.avatar.url}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingFriendRequest}
            />
          ))}
        </Stack>
      )}
    </Stack>
  </Dialog>  )
}

export default SearchD;
