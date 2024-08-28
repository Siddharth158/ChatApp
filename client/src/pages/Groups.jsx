import React, { lazy, memo, Suspense, useEffect, useState } from 'react'
import { Backdrop, Box, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace, Menu as MenuIcon } from "@mui/icons-material";
import { matBlack } from '../components/constants/color'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link } from '../components/styles/StyledComponents'
import AvatarCard from '../components/shared/AvatarCard'
import { Samplechats, SampleUsers } from '../components/constants/sampleData'
import UserItem from '../components/shared/UserItem';

const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'))
const AddMemeberDialog = lazy(() => import('../components/dialogs/AddMemeberDialog'))
const isAddMember = false;

function Groups() {

  const navigate = useNavigate();
  const navigateBack = () => {
    navigate('/')
  }

  const chatId = useSearchParams()[0].get('group')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState('');
  const [confirDeleteDialog, setDeleteDialog] = useState(false)
  const handleMobile = () => {
    setIsMobileMenuOpen(prev => !prev);
  }
  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  }
  const updateGroupNameHandler = () => {
    setIsEdit(false);
  }

  

  useEffect(() => {
    if(chatId){
      setGroupName('Group name');
    setGroupNameUpdatedValue('group name');
    }
    
    return () => {
      setGroupName('');
      setGroupNameUpdatedValue('')
      setIsEdit(false)
    }
  }, [chatId]);

  const openConfirmDeleteHandler = () => { setDeleteDialog(true) }
  const closeConfirmDeleteHandler = () => { setDeleteDialog(false) }
  const deleteHandler =()=>{}
  const openAddMember = () => { }
  const removeMemberHandler =(id)=>{console.log(id)}

  const IconBtns = (
    <>

      <Box sx={{
        display: {
          xs: 'block',
          sm: 'none',
        },
        position: 'fixed',
        right: '2rem',
        top: '2rem'
      }} >
        <IconButton onClick={handleMobile} >
          <MenuIcon />
        </IconButton>
      </Box>



      <Tooltip title='back'>
        <IconButton
          sx={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            bgcolor: matBlack,
            color: 'white',
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            }
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspace />
        </IconButton>
      </Tooltip>

    </>)

  const GroupName = <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} padding={'3rem'}>
    {
      isEdit ? <>
        <TextField value={groupNameUpdatedValue} onChange={(e) => (setGroupNameUpdatedValue(e.target.value))} />
        <IconButton onClick={updateGroupNameHandler}><DoneIcon /></IconButton>
      </> : <>
        <Typography variant='h4'>{groupName}</Typography>
        <IconButton onClick={() => setIsEdit(true)}><EditIcon /></IconButton>
      </>
    }
  </Stack>

  const ButtonGroup = <Stack
    direction={{
      sm: 'row',
      xs: 'column-reverse',
    }}
    spacing={'1rem'}
    p={{
      sm: '1rem',
      xs: '0',
      md: '1rem 4rem'
    }}>
    <Button
      size='large'
      color='error'
      variant='outlined'
      startIcon={<DeleteIcon />}
      onClick={openConfirmDeleteHandler}>Delete Group</Button>
    <Button size='large' variant='contained' startIcon={<AddIcon />} onClick={openAddMember}>Add Member</Button>
  </Stack>

  return (
    <Grid container height={'100vh'}>
      <Grid item
        sx={{
          display: {
            xs: 'none',
            sm: 'block',
          },
        }}
        sm={4}
        >
        <GroupList myGroups={Samplechats} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          padding: '1rem 3rem'
        }}>
        {IconBtns}
        {groupName && <>
          {GroupName}
          <Typography margin={'2rem'} alignSelf={'flex-start'} variant='body1'>Members</Typography>
          <Stack
            maxWidth={'45rem'}
            width={'100%'}
            boxSizing={'border-box'}
            padding={{
              sm: '1rem',
              xs: '0',
              md: '1rem 4rem',
            }}
            // spacing={'0.5rem'}
            // bgcolor={'bisque'}
            height={'50vh'}
            overflow={'auto'}>
            {
              SampleUsers.map((user)=>(
                <UserItem key={user._id} user={user} isAdded styling={{
                  boxShadow: '0 0 0.5rem rgba(0,0,0,0.2)',
                  padding: '1rem 2rem',
                  borderRadius: '1rem'
                }} handler={removeMemberHandler}/>
              ))
            }
          </Stack>
          {ButtonGroup}
        </>}

      </Grid>
      {
        confirDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog open={confirDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler} />
        </Suspense>)
      }

{
  isAddMember && <Suspense fallback={<Backdrop open />}>
    <AddMemeberDialog  />
  </Suspense>
}

      <Drawer sx={{
        display: {
          xs: 'block',
          sm: 'none',
        },
      }} open={isMobileMenuOpen} onClose={handleMobileClose}>
        <GroupList w={'50vw'} myGroups={Samplechats} chatId={chatId} />
      </Drawer>
    </Grid>
  )
}


const GroupList = ({ w="100%", myGroups = [], chatId }) => (
  <Stack spacing={'0.2rem'} width={w} sx={{
    bgcolor:'bisque',
    height: '100vh',
    overflow: 'auto'
  }}>
    {
      myGroups.length > 0 ? myGroups.map((group) => <GroupListItem key={group._id} group={group} chatId={chatId} />) : (
        <Typography textAlign={'center'} padding='1rem'>
          No Groups
        </Typography>
      )
    }
  </Stack>
)
const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return <Link to={`?group=${_id}`} style={{boxShadow: '0 0 0.5rem rgba(0,0,0,0.2)'}} onClick={e => {
    if (chatId === _id) e.preventDefault();
  }} >
    <Stack sx={{
      flexDirection: 'row',
      position: 'relative',
      alignItems: 'center',
    }}>
      <AvatarCard avatar={avatar} />
      <Typography>
        {name}
      </Typography>
    </Stack>
  </Link>
})
export default Groups