import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from '@mui/material';
import React, { Fragment, useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { grayColor, orange } from '../components/constants/color';
import { NEW_MESSAGE } from '../components/constants/events';
import AppLayout from '../components/layout/AppLayout';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponents';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { getSocket } from '../socket';
import { useInfiniteScrollTop } from '6pp'

const Chat = ({ chatId }) => {

  const containerRef = useRef(null);
  const socket = getSocket()

  const { user } = useSelector(state => state.auth)


  const [message, setMessage] = useState("")
  const [messageArray, setMessageArray] = useState([])
  const [page, setPage] = useState(1)


  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId })
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page })
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  )


  const submitHandler = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    // console.log(socket)
    socket.emit(NEW_MESSAGE, { chatId, members, message })
    setMessage("")
  }

  const newMessageHandler = useCallback((data) => {
    // console.log(data)
    setMessageArray((prev) => [...prev, data.message])
  }, [])

  const errors = [
    {
      isError: chatDetails.isError,
      error: chatDetails.error,
    },
    {
      isError: oldMessagesChunk.isError,
      error: oldMessagesChunk.error,
    }
  ]
  const members = chatDetails?.data?.chat?.members
  const eventArr = { [NEW_MESSAGE]: newMessageHandler }
  const allMessages = [...oldMessages, ...messageArray]
  // console.log(allMessages)


  useSocketEvents(socket, eventArr)
  useErrors(errors)

  return chatDetails.isLoading ? <Skeleton /> : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={'border-box'}
        padding={'1rem'}
        spacing={'1rem'}
        bgcolor={grayColor}
        height={'90%'}
        sx={{
          overflowX: 'hidden',
          overflowY: 'auto'
        }}>
        {
          allMessages.map((message, index) => <MessageComponent key={index} message={message} user={user} />)
        }
      </Stack>
      <form style={{
        height: '10%',
      }}
        onSubmit={submitHandler}
      >
        <Stack direction={'row'} height={'100%'} padding={'1rem'} alignItems={'center'} position={'relative'} gap={'0.5rem'}>
          <IconButton >
            <AttachFileIcon />
          </IconButton>
          <InputBox placeholder='Type Message' value={message} onChange={e => setMessage(e.target.value)} />
          <IconButton type='submit' sx={{
            backgroundColor: orange,
            color: "white",
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
    </Fragment>
  )
}

export default AppLayout()(Chat)