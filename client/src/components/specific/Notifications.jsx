import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useErrors } from '../../hooks/hook';
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from '../../redux/api/api';
import { setIsNotification } from '../../redux/reducers/misc';

const Notifications = () => {

  const {isNotification} = useSelector(state=>state.misc)
  const dispatch = useDispatch();

  const { isLoading, data, error, isError } = useGetNotificationQuery()

  useErrors([{ error, isError }]);

  const [acceptRequest] = useAcceptFriendRequestMutation()

  const friendRequestHandler = async({ _id, accept }) => {
    dispatch(setIsNotification(false))
try {
  const res = await acceptRequest({requestId: _id, accept});
  console.log(res)
  if(res.data?.success){
    console.log("use socket")
    toast.success(res.data.message);
  }
  else{
    toast.error(res?.data?.message || "Something went wrong")
  }
} catch (error) {
  console.log(error)
  toast.error("Something went wrong");
}
  }

  const closeHandler = ()=>{
    dispatch(setIsNotification(false))
  }
  return (
    <Dialog open ={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: '1rem', sm: '2rem' }} maxWidth={'25rem'}>
        <DialogTitle>Notifications</DialogTitle>
        {
          isLoading ? <Skeleton /> : <>
            {
              data?.allRequests.length > 0 ? (data.allRequests.map((notification) => <NotificationItem sender={notification.sender} _id={notification._id} handler={friendRequestHandler} key={notification._id} />)) : <Typography textAlign={'center'}>
                0 Notifications
              </Typography>
            }
          </>
        }
      </Stack>
    </Dialog>
  )
}

export default Notifications

const NotificationItem = memo(({ sender, _id, handler }) => {
  return (
    <ListItem>
      <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'}>
        <Avatar />
        <Typography
          variant='body1'
          sx={{
            flexGlow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%'
          }}>
          {`${sender.name}`}
        </Typography>
        <Stack direction={{
          xs: 'column',
          sm: 'row'
        }}>
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color='error' onClick={() => handler({ _id, accept: false })}>Reject</Button>
        </Stack>
      </Stack>
    </ListItem>
  )
})