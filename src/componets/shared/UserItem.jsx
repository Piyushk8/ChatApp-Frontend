import { Avatar, IconButton, Stack, Typography , ListItem } from '@mui/material';
import React,{memo} from 'react'
import { Remove as RemoveIcon , Add as AddIcon } from '@mui/icons-material';
import { transformImage } from '../../lib/features';
const UserItem = ({ user, handler, handlerIsLoading, isAdded = false, styling = {} }) => {
    const { name, avatar, _id } = user;
  
    return (
      <ListItem>
        <Stack
          direction="row"
          alignItems="center"
          spacing="1rem"
          width="100%"
          sx={{ ...styling }}
        >
          <Avatar src={transformImage(avatar.url)} />
          <Typography
            sx={{font:"menu", fontSize:"1rem",
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </Typography>
          <IconButton
            sx={{
              bgcolor: isAdded ? 'error.main' : '#215C54',
              color: 'white',
              '&:hover': {
                bgcolor: isAdded ? 'error.main' : "darkgreen",
              },
              width: '30px', // Fix width
              height: '30px', // Fix height
            }}
            
            onClick={() => handler(_id)}
            disabled={handlerIsLoading}
          >
            {isAdded ? <RemoveIcon /> : <AddIcon color='darkgreen' />}
          </IconButton>
        </Stack>
      </ListItem>
    );
  };
  
export default memo(UserItem)
