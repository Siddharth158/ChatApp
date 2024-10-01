import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react'
import { Face as FaceIcon, AlternateEmail as UserNameIcon, CalendarMonth as CalenderIcon } from "@mui/icons-material";
import moment  from "moment";
import { useSelector } from 'react-redux';

const Profile = () => {
    const { user } = useSelector(state => state.auth)
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
        <Avatar 
        src={user?.avatar?.url}
        sx={{
            width:200,
            height:200,
            objectFit:'contain',
            marginBottom:'1rem',
            border: '5px solid white', 
        }} />
    <ProfileCard heading={"bio"} text={user?.bio} />
    <ProfileCard heading={"username"} text={user?.username} Icon={<UserNameIcon/>} />
    <ProfileCard heading={"name"} text={user?.name} Icon={<FaceIcon />} />
    <ProfileCard heading={"joined"} text={moment(user?.createdAt).fromNow()} Icon={<CalenderIcon />} />
    </Stack>
  )
}
const ProfileCard = ({text, Icon, heading}) => (
    <Stack 
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
    >
        {Icon && Icon}
        <Stack>
            <Typography variant='body1'>{text}</Typography>
            <Typography color={'grey'} variant='caption'>{heading}</Typography>
        </Stack>

    </Stack>
);
export default Profile