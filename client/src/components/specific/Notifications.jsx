import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { SampleNotifications } from "../constants/sampleData";

const Notifications = () => {
  const friendRequestHandler = ({ _id, accept }) => {

  }
  return (
    <Dialog open>
      <Stack p={{ xs: '1rem', sm: '2rem' }} maxWidth={'25rem'}>
        <DialogTitle>Notifications</DialogTitle>
        {
          SampleNotifications.length > 0 ? (SampleNotifications.map((notification) => <NotificationItem sender={notification.sender} _id={notification._id} handler={friendRequestHandler} key={notification._id} />)) : <Typography textAlign={'center'}>
            0 Notifications
          </Typography>
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