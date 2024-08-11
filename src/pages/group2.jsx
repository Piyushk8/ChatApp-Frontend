import {
    Add as AddIcon,
    Cancel,
    Delete as DeleteIcon,
    Done as DoneIcon,
    Edit as EditIcon,
    KeyboardBackspace as KeyboardBackspaceIcon,
    Menu as MenuIcon,
    Title,
  } from "@mui/icons-material";
  import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Dialog,
    Divider,
    Drawer,
    Grid,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
  } from "@mui/material";
  import React, { Suspense, lazy, memo, useEffect, useState } from "react";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import  LayoutLoader  from "../componets/Loaders/Layoutloader";
  import AvatarCard from "../componets/shared/AvatarCard";
  import { LinkComponent } from "../componets/StyledComponent";
  import { useDispatch, useSelector } from "react-redux";
  import UserItem from "../componets/shared/UserItem";
  import { useAsyncMutation, useErrors } from "../hooks/hook";
  import {
    useChatDetailsQuery,
    useDeleteChatMutation,
    useGetMyGroupsQuery,
    useRemoveGroupMemberMutation,
    useRenameGroupMutation,
  } from "../redux/api/api";
  import { setIsAddMember } from "../redux/reducer/misc";
  import groupList from "../assets/groupList.webp"
  const ConfirmDeleteDialog = lazy(() =>
    import("../componets/Dialog.jsx/ConfirmDeleteDialog")
  );
  const AddMemberDialog = lazy(() =>
    import("../componets/Dialog.jsx/AddMemberDialog")
);


const Group2 = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [members, setMembers] = useState([]);
  const { isAddMember } = useSelector((state) => state.misc);
  
  //Rtk Quries
  const {data:myGroups,isError:myGroupsIsError,error:myGroupsError,isLoading:isLoadingMygroups,refetch:refetchMyGroups} = useGetMyGroupsQuery("");
  const {data:groupDetails,isError:groupDetailsIsError,error:groupDetailsError,refetch:refetchGroupDetails} = useChatDetailsQuery({chatId , populate:true},{skip:!chatId})
  const [deleteGroup , isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation)
  const [renameGroup ,isLoadingGroupName ] = useAsyncMutation(useRenameGroupMutation)
  const [removeMember ,isLoadingRemoveMember  ] = useAsyncMutation(useRemoveGroupMemberMutation)
  
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  
    const errors = [
      {
        isError:myGroupsIsError,
        error: myGroupsError,
      },
      {
        isError: groupDetailsIsError,
        error: groupDetailsError,
      },
    ];
  
    useErrors(errors);
  
    
    const navigateBack = () => {
      navigate("/");
    };
    
    const handleMobile = () => {
      setIsMobileMenuOpen((prev) => !prev);
    };
    
    const handleMobileClose = () => setIsMobileMenuOpen(false);
    
    const updateGroupName = async() => {
      setIsEdit(false);
      await renameGroup("Updating Group Name...", {
        chatId,
        name: groupNameUpdatedValue,
      })

       refetchMyGroups()
       refetchGroupDetails()
      
    };
    
    const openConfirmDeleteHandler = () => {
      setConfirmDeleteDialog(true);
    };
    
    const closeConfirmDeleteHandler = () => {
      setConfirmDeleteDialog(false);
    };
    
    const openAddMemberHandler = () => {
      dispatch(setIsAddMember(true));
      
    };
    
    const deleteHandler = async() => {
      await deleteGroup("Deleting Group...", {id:chatId});
      refetchMyGroups()
      refetchGroupDetails()
      closeConfirmDeleteHandler();
      
      navigate("/groups");
      // refetch();
    };
    
    const removeMemberHandler = async(userId) => {
     await removeMember("Removing Member...", { chatId, userId });
      refetchMyGroups()
       refetchGroupDetails()
    };
    
    useEffect(() => {
      if (chatId) {
        setGroupName(`${groupDetails?.chat?.name}`);
        setGroupNameUpdatedValue(`${groupDetails?.chat?.name}`);
      }
      
      return () => {
        setGroupName("");
        setGroupNameUpdatedValue("");
        setIsEdit(false);
      };
    }, [chatId]);
    
    useEffect(() => {
      const groupData = groupDetails;
      if (groupData) {
        setGroupName(groupData?.chat?.name);
        setGroupNameUpdatedValue(groupData?.chat?.name);
        setMembers(groupData.chat.members);
      }
    
      return () => {
        setGroupName("");
        setGroupNameUpdatedValue("");
        setMembers([]);
        setIsEdit(false);
      };
    }, [myGroups,groupDetails]);
    
    const IconBtns = (
      <>
        <Box
          sx={{
            display: {
              xs: "block",
              sm: "none",
              position: "fixed",
              right: "1rem",
              top: "1rem",
            },
          }}
        >
          <IconButton onClick={handleMobile}>
            <MenuIcon />
          </IconButton>
        </Box>
  
        <Tooltip title="back">
          <IconButton
            sx={{
              position: "absolute",
              top: "2rem",
              left: "2rem",
              bgcolor:"darkgreen",//!color
              color: "white",
              ":hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
            onClick={navigateBack}
          >
            <KeyboardBackspaceIcon />
          </IconButton>
        </Tooltip>
      </>
    );

    const GroupName = (
      <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        spacing={"1rem"}
        padding={"3rem"}
      >
        {isEdit ? (
          <>
            <TextField
              placeholder="Enter new name"
              value={groupNameUpdatedValue}
              onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            />
            <IconButton sx={{color:'green'}} onClick={updateGroupName} disabled={isLoadingGroupName}>
              <DoneIcon/>
            </IconButton>
            <IconButton sx={{color:"red"}} onClick={()=>setIsEdit(false)}><Cancel/></IconButton>
          </>
        ) : (
          <>
        
            
                <Typography sx={{
                  transition: 'color 0.3s',
                  '&:hover': {
                    color: 'primary.main',}
                }} variant="h4">{groupName}</Typography>
              
                <IconButton
                disabled={isLoadingGroupName}
                onClick={() => setIsEdit(true)}
                >
                <EditIcon fontSize="small" />
                </IconButton>
                
          
          </>
        )}
      </Stack>
      </>
    );
    
    
    const ButtonGroup = (
      <Stack
      direction={{
          xs: "column-reverse",
          sm: "row",
        }}
        spacing={"1rem"}
        p={{
          xs: "0",
          sm: "1rem",
          md: "1rem 4rem",
        }}
      >
        <Button
          size="large"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={openConfirmDeleteHandler}
          >
          Delete Group
        </Button>
        <Button
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddMemberHandler}
          >
          Add Member
        </Button>
      </Stack>
    );
    
    //! whole body starts here
    return isLoadingMygroups ? (
      <LayoutLoader />
    ) : (
    
      <Grid container height={"100vh"}>
        <Grid
          item
          sx={{
           
            borderRight:'dashed lightgrey 1px',
            height:'100%',
            display: {
              xs: "none",
              sm: "block",
            },
          }}
          sm={4}
        >
          <GroupsList myGroups={myGroups?.transformedGroups} chatId={chatId} />
        </Grid>
  
        <Grid
          height={"100%"}
          item
          xs={12}
          sm={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            padding: "1rem 3rem",
          }}
          >
          <Stack direction={"row"} justifyContent={"space-between"}>
            {IconBtns}
            <Typography 
            fullwidth
            color={"black"}
            variant="h1"
            
            sx={{mt:"1.1rem",fontSize:{xs:"2rem",sm:"2.5rem",md:"3rem"},fontFamily:"Bebas Neue"}}
            > Manage Group</Typography>
          </Stack>
         
          {groupName ? (
            <Box  overflow={"auto"}>
            {GroupName}
  
              <Typography
                marginTop={"1.5rem"}
                variant="body1"
                fontSize={"1.2rem"}
                sx={{alignSelf:"start"}}
              >
               All Members 
               <Typography sx={{fontsize:"0.8rem",color:"grey",textAlign:"center",mt:"1rem"}}>Deselect members to remove them</Typography>
              </Typography>
  
              <Stack
                maxWidth={"45rem"}
                width={"100%"}
                boxSizing={"border-box"}
                padding={{
                  sm: "1rem",
                  xs: "0",
                  md: "1rem",
                }}
                height={"fit"}
                overflow={"auto"}
              >
                {/* Members */}
  
                {isLoadingRemoveMember ? (
                  <CircularProgress />
                ) : (
                  members.map((i) => (
                    <UserItem
                      user={i}
                      key={i._id}
                      isAdded
                      styling={{
                        boxShadow: "0 0 0.5rem  rgba(0,0,0,0.2)",
                        padding: "1rem 2rem",
                        borderRadius: "1rem",
                      }}
                      handler={removeMemberHandler}
                    />
                  ))
                )}
              </Stack>
  
              {ButtonGroup}
              </Box>
              
          ) :  
                <Box 
                 sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${groupList})`,
                  backgroundSize:"cover", 
                  backgroundPosition: 'top', 
                  backgroundRepeat: 'no-repeat',}}>
                    <Typography sx={{color:"grey",textAlign:'center',mt:"2rem"}}>Select a Group to Make Changes</Typography>
                </Box>
                }
              
        </Grid>
  
        {isAddMember && (
          <Suspense fallback={<Backdrop open={true} />}>
            <AddMemberDialog chatId={chatId} />
          </Suspense>
        )}
  
        {confirmDeleteDialog && (
          <Suspense fallback={<Backdrop open={true} />}>
            <ConfirmDeleteDialog
              open={confirmDeleteDialog}
              handleClose={closeConfirmDeleteHandler}
              deleteHandler={deleteHandler}
            />
          </Suspense>
        )}
  {/* drawer for small screens */}
        <Drawer
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
          }}
          open={isMobileMenuOpen}
          onClose={handleMobileClose}
        >
          <GroupsList
            w={"70vw"}
            myGroups={myGroups?.transformedGroups}
            chatId={chatId}
          />
        </Drawer>
      </Grid>

    );
  };
  



  const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
    return(
    <Stack
      width={w}
      sx={{
        bgcolor:"#E5E4E2",
        height: "100vh",
        overflow: "auto"
        ,gap:'1rem'
      }}
      >
        <Box height={"fit"} 
          sx={{textAlign:"center" ,
                px:"1rem", 
                mt:'1rem',
                color:"#00a86b",
                font:'menu',
                fontFamily: "",
                mb:'2.5rem'
              }}
        
        >
          <Typography sx={{ 
            fontSize:'2rem',
            fontWeight:'600'
            ,fontFamily:"Belleza, sans-serif"
            }}>
            Your Groups </Typography></Box>
        
        <Divider sx={{width:'70%' ,alignSelf:"center"}}/>
      
        {myGroups.length > 0 ? (
          myGroups.map((group) => (
            <GroupListItem group={group} chatId={chatId} key={group._id} />
          ))
        ) : (<>
          <Typography textAlign={"center"}
            padding="1rem"
            sx={{
              fontSize:{xs:"1.2rem",md:"2rem"}
              ,fontFamily:" sans-serif",
              fontWeight:'bold',color:"grey"}}
            
            >
            No groups Found <br></br> Make some groups
          </Typography>
          </>
        )}
    </Stack>)
  };
  
  const GroupListItem = memo(({ group, chatId }) => {
    const { name, avatar, _id } = group;
  
    return (
      <LinkComponent
        to={`?group=${_id}`}
        onClick={(e) => {
          handleClose();
          if (chatId === _id) e.preventDefault();
        }}
      >
        <Stack direction={"row"} 
          spacing={"1rem"} 
          alignItems={"center"}
          bgcolor={"white"}
          pl={"2rem"}
          pb={"1rem"}
          >
          <AvatarCard avatar={avatar} />
          <Typography
            sx={{fontsize:"1rem",overflow:"hidden",textOverflow:"ellipsis"}}
          >{name}</Typography>
        </Stack>
        <Divider sx={{width:"70%",ml:"5rem"}}/>
      </LinkComponent>
    );
  });
  
  export default Group2;
