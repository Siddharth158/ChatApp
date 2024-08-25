import { Avatar, AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'

const AvatarCard = ({ avatar = [], max = 4 }) => {
    return (
        <Stack direction={"row"} spacing={0.5}>
            <AvatarGroup max={max}>
                <Box width={'5rem'} height={'3rem'}></Box>
                {avatar.map((i, index) => (
                    <Avatar
                        key={Math.random() *100}
                        src={i}
                        alt={`avatar ${index}`}
                        sx={{
                            width: "2rem",
                            height: "2rem",
                            position: 'absolute',
                            left: {
                                xs: `${1+index}rem`,
                                sm: `${index+1}rem`,
                            },
                            top:'50%',
                            transform: 'translateY(-50%)'
                        }} />
                ))}
            </AvatarGroup>
        </Stack>
    )
}

export default AvatarCard