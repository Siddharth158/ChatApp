import { Box, Typography } from '@mui/material';
import { lightBlue } from '../constants/color';
import React, { memo } from 'react'
import moment from 'moment';
import { fileFormat } from '../../lib/features';
import RenderAttachmnet from './RenderAttachmnet';

const MessageComponent = ({message, user}) => {
    const {sender, content, attachments=[],createdAt} = message; 
    // console.log("sender" ,sender)
    // console.log("user" ,user._id)
    const sameSender = sender._id === user._id;
    // console.log(sameSender)
    const timeAgo = moment(createdAt).fromNow()
  return (
    <div style={{
        alignSelf: sameSender?'flex-end':'flex-start',
        backgroundColor: 'white',
        color:'black',
        borderRadius:'4px',
        padding: '0.5rem',
        width: 'fir-content', 
    }}>
        {!sameSender && <Typography color={lightBlue} fontWeight={'600'} variant='caption'>{sender.name}</Typography>}
        {content && <Typography>{content}</Typography>}
        {
            attachments.length > 0 && attachments.map((item,index)=>{
                const url = item.url;
                const file = fileFormat(url);

                return(
                    <Box key={index}>
                        <a href={url} target='_blank' download style={{
                            color: 'black',
                        }}>
                            <RenderAttachmnet file={file} url={url}/>
                        </a>
                    </Box>
                )
            })
        }

        <Typography variant='caption' color={'text.secondary'}>{timeAgo}</Typography>
    </div>
  )
}

export default memo(MessageComponent);