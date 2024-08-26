import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react'
import { Face as FaceIcon, AlternateEmail as UserNameIcon, CalendarMonth as CalenderIcon } from "@mui/icons-material";
import moment  from "moment";

const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
        <Avatar 
        sx={{
            width:200,
            height:200,
            objectFit:'contain',
            marginBottom:'1rem',
            border: '5px solid white', 
        }} />
    <ProfileCard heading={"bio"} text={"text"} />
    <ProfileCard heading={"username"} text={"text1"} Icon={<UserNameIcon/>} />
    <ProfileCard heading={"name"} text={"text2"} Icon={<FaceIcon />} />
    <ProfileCard heading={"joined"} text={moment('2024-01-23T00:00:00.000Z').fromNow()} Icon={<CalenderIcon />} />
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