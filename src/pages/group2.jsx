import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Done as DoneIcon,
    Edit as EditIcon,
    KeyboardBackspace as KeyboardBackspaceIcon,
    Menu as MenuIcon,
  } from "@mui/icons-material";
  import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
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
  //import { bgGradient, matBlack } from "../constants/color";
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
    console.log(chatId)
    const { isAddMember } = useSelector((state) => state.misc);
    const myGroups = useGetMyGroupsQuery("");
   
    const groupDetails = useChatDetailsQuery({chatId , populate:true},{skip:!chatId})
    const [deleteGroup , isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation)
    
    const [renameGroup ,isLoadingGroupName ] = useAsyncMutation(useRenameGroupMutation)
    
    const [removeMember ,isLoadingRemoveMember  ] = useAsyncMutation(useRemoveGroupMemberMutation)
    
  
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  
    const [groupName, setGroupName] = useState("");
    const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  
    const [members, setMembers] = useState([]);
  
    const errors = [
      {
        isError: myGroups.isError,
        error: myGroups.error,
      },
      {
        isError: groupDetails.isError,
        error: groupDetails.error,
      },
    ];
  
    useErrors(errors);
  
    useEffect(() => {
      const groupData = groupDetails.data;
      if (groupData) {
        console.log(groupData)
        setGroupName(groupData.chat.name);
        setGroupNameUpdatedValue(groupData.chat.name);
        setMembers(groupData.chat.members);
      }
  
      return () => {
        setGroupName("");
        setGroupNameUpdatedValue("");
        setMembers([]);
        setIsEdit(false);
      };
    }, [groupDetails.data]);
  
    const navigateBack = () => {
      navigate("/");
    };
  
    const handleMobile = () => {
      setIsMobileMenuOpen((prev) => !prev);
    };
  
    const handleMobileClose = () => setIsMobileMenuOpen(false);
  
    const updateGroupName = () => {
      setIsEdit(false);
      updateGroup("Updating Group Name...", {
        chatId,
        name: groupNameUpdatedValue,
      });
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
  
    const deleteHandler = () => {
      deleteGroup("Deleting Group...", chatId);
      closeConfirmDeleteHandler();
      navigate("/groups");
    };
  
    const removeMemberHandler = (userId) => {
      removeMember("Removing Member...", { chatId, userId });
    };
  
    useEffect(() => {
      if (chatId) {
        setGroupName(`Group Name ${chatId}`);
        setGroupNameUpdatedValue(`Group Name ${chatId}`);
      }
  
      return () => {
        setGroupName("");
        setGroupNameUpdatedValue("");
        setIsEdit(false);
      };
    }, [chatId]);
  
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
              bgcolor:"#1c1c1c",//!color
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
              value={groupNameUpdatedValue}
              onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            />
            <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
              <DoneIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h4">{groupName}</Typography>
            <IconButton
              disabled={isLoadingGroupName}
              onClick={() => setIsEdit(true)}
            >
              <EditIcon />
            </IconButton>
          </>
        )}
      </Stack>
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

    return myGroups.isLoading ? (
      <LayoutLoader />
    ) : (
      <Grid container height={"100vh"}>
        <Grid
          item
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
          sm={4}
        >
          <GroupsList myGroups={myGroups?.data?.transformedGroups} chatId={chatId} />
        </Grid>
  
        <Grid
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
          {IconBtns}
  
          {groupName && (
            <>
              {GroupName}
  
              <Typography
                margin={"2rem"}
                alignSelf={"flex-start"}
                variant="body1"
              >
                Members
              </Typography>
  
              <Stack
                maxWidth={"45rem"}
                width={"100%"}
                boxSizing={"border-box"}
                padding={{
                  sm: "1rem",
                  xs: "0",
                  md: "1rem 4rem",
                }}
                spacing={"2rem"}
                height={"50vh"}
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
            </>
          )}
        </Grid>
  
        {isAddMember && (
          <Suspense fallback={<Backdrop open />}>
            <AddMemberDialog chatId={chatId} />
          </Suspense>
        )}
  
        {confirmDeleteDialog && (
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteDialog
              open={confirmDeleteDialog}
              handleClose={closeConfirmDeleteHandler}
              deleteHandler={deleteHandler}
            />
          </Suspense>
        )}
  
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
            w={"50vw"}
            myGroups={myGroups?.data?.transformedGroups}
            chatId={chatId}
          />
        </Drawer>
      </Grid>
    );
  };
  
  const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
    
    <Stack
      width={w}
      sx={{
        backgroundImage: "linear-gradient(rgb(255 225 209), rgb(249 159 159))",
        height: "100vh",
        overflow: "auto",
      }}
    >
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItem group={group} chatId={chatId} key={group._id} />
        ))
      ) : (
        <Typography textAlign={"center"} padding="1rem">
          No groups
        </Typography>
      )}
    </Stack>
  );
  
  const GroupListItem = memo(({ group, chatId }) => {
    const { name, avatar, _id } = group;
  
    return (
      <LinkComponent
        to={`?group=${_id}`}
        onClick={(e) => {
          if (chatId === _id) e.preventDefault();
        }}
      >
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          <AvatarCard avatar={avatar} />
          <Typography>{name}</Typography>
        </Stack>
      </LinkComponent>
    );
  });
  
  export default Group2;