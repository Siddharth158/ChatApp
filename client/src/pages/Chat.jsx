import React, { useRef } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Stack } from '@mui/material'
import { grayColor, orange } from '../components/constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { InputBox } from '../components/styles/StyledComponents';
import { sampleMessage } from '../components/constants/sampleData';
import MessageComponent from '../components/shared/MessageComponent';

function Chat() {
  const containerRef = useRef(null);
  const sampleUser = {
    _id:"sfr",
    name: 'sadfln',
  }
  return (
    <>
      <Stack 
      ref={containerRef}
      boxSizing={'border-box'}
      padding={'1rem'}
      spacing={'1rem'}
      bgcolor={grayColor}
      height={'90%'}
      sx={{
        overflowX:'hidden',
        overflowY:'auto'
      }}>
{
  sampleMessage.map((message,index)=><MessageComponent key={index} message={message} user={sampleUser} />)
}
      </Stack>
      <form style={{
        height:'10%',
      }}>
        <Stack direction={'row'} height={'100%'} padding={'1rem'} alignItems={'center'} position={'relative'} gap={'0.5rem'}>
          <IconButton >
            <AttachFileIcon />
          </IconButton>
          <InputBox placeholder='Type Message' />
          <IconButton type='submit' sx={{
            backgroundColor: orange,
            color:"white",
            marginLeft: '1rem',
            padding: '0.5rem',
            "&:hover": {
              bgcolor: "error.dark",
            }
          }}  >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
    </>
  )
}

export default AppLayout()(Chat)