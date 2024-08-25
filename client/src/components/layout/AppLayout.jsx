import React from 'react'
import Header from "../layout/Header";
import Title from '../shared/Title';
import { Grid } from '@mui/material';
import ChatList from '../specific/ChatList';
import { Samplechats } from '../constants/sampleData';
import { useParams } from 'react-router-dom';

const AppLayout = () => (WrappedComponent) => {
    return (props) => {

        const params = useParams();
        const chatId = params.chatId;
        const handleDeleteChat = (e, _id, groupChat) => {
            e.preventDefault();
            console.log("delete chat", _id, groupChat);
        }

        return (
            <>
                <Title title='apna telegram' />
                <Header />
                <Grid container height={"calc(100vh -4rem)"}>
                    <Grid
                        item
                        sm={4}
                        md={3}
                        sx={{ display: { xs: "none", sm: "block" } }}
                        height={"100%"}
                    >
                        <ChatList chats={Samplechats} chatId={chatId} handleDeleteChat={handleDeleteChat} />
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
                        table2
                    </Grid>
                </Grid>


            </>
        )
    }
}


export default AppLayout