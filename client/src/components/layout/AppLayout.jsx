import React, { useEffect } from 'react'
import Header from "../layout/Header";
import Title from '../shared/Title';
import { Drawer, Grid, Skeleton } from '@mui/material';
import ChatList from '../specific/ChatList';
import { Samplechats } from '../constants/sampleData';
import { useParams } from 'react-router-dom';
import Profile from '../specific/Profile';
import { useMyChatsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobileMenu } from '../../redux/reducers/misc';
import { useErrors } from '../../hooks/hook';

const AppLayout = () => (WrappedComponent) => {
    return (props) => {

        const params = useParams();
        const chatId = params.chatId;

        const { isMobileMenu } = useSelector(state => state.misc)
        const dispatch = useDispatch()

        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("")

        useErrors([{isError,error}]);


        const handleDeleteChat = (e, _id, groupChat) => {
            e.preventDefault();
            console.log("delete chat", _id, groupChat);
        }

        const handleMobileClose = () => dispatch(setIsMobileMenu(false))

        return (
            <>
                <Title title='apna telegram' />
                <Header />

                {
                    isLoading ? <Skeleton /> : (
                        <Drawer open={isMobileMenu} onClose={handleMobileClose} >
                            <ChatList
                                w="70vw"
                                chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} />
                        </Drawer>
                    )
                }
                <Grid container height={"calc(100vh - 4rem)"}>
                    <Grid
                        item
                        sm={4}
                        md={3}
                        sx={{
                            display: { xs: "none", sm: "block" },
                            overflow: 'auto'
                        }}
                        height={"100%"}
                    >
                        {isLoading ? <Skeleton /> : (<ChatList chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} />)}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={5}
                        lg={6}
                        height={"100%"}
                    >
                        <WrappedComponent {...props} />
                    </Grid>
                    <Grid
                        item
                        sx={{ display: { xs: "none", md: "block" }, padding: "2rem", bgcolor: "rgba(0,0,0,0.85)" }}
                        md={4}
                        lg={3}
                        height={"100%"}
                    >
                        <Profile />
                    </Grid>
                </Grid>


            </>
        )
    }
}


export default AppLayout