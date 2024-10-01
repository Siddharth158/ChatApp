import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { lazy, Suspense, useState } from 'react'
import { orange } from "../constants/color";
import { Add as AddIcon, Menu as Menuicon, Search as SearchIcon, Group as GroupIcon, Logout as LogoutIcon, Notifications as NotificationIcon } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { server } from '../constants/config';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userNotExists } from '../../redux/reducers/auth';
import { setIsMobileMenu, setIsSearch, setIsNotification } from '../../redux/reducers/misc';
const SearchDialog = lazy(() => import('../specific/Search'))
const NotificationDialog = lazy(() => import('../specific/Notifications'))
const NewGroupDialog = lazy(() => import('../specific/NewGroup'))

const Header = () => {
    const navigate = useNavigate()
    const { isSearch, isNotification } = useSelector(state => state.misc);
    const [isNewGroup, setIsNewGroup] = useState(false);
    const dispatch = useDispatch();
    const handleMobile = () => {
        dispatch(setIsMobileMenu(true))
        console.log("m")
    }

    const openSearch = () => {
        dispatch(setIsSearch(true))
    }

    const openNewGroup = () => {
        setIsNewGroup(prev => (!prev));
    }

    const openNotification = () => {
        dispatch(setIsNotification(true))
    }

    const navigateToGroup = () => navigate("/groups")

    const handleLogout = async () => {
        try {
            const { data } = await axios.get(`${server}/api/v1/user/logout`, { withCredentials: true })
            dispatch(userNotExists())
            toast.success(data.message);
        } catch (error) {
            toast.error(error.res.data.message || 'Something went wrong')
        }


    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={"4rem"} >
                <AppBar position='static' sx={{ bgcolor: orange }} >
                    <Toolbar>
                        <Typography variant='h6' sx={{ display: { xs: "none", sm: "block" } }}>
                            Apna telegram
                        </Typography>
                        <Box sx={{ display: { xs: "block", sm: "none" } }} >
                            <IconButton color='inherit' onClick={handleMobile}>
                                <Menuicon />
                            </IconButton>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box>
                            <IconBtn title="Search" icon={<SearchIcon />} onClick={openSearch} />
                            <IconBtn title="New Group" icon={<AddIcon />} onClick={openNewGroup} />
                            <IconBtn title="Manage Groups" icon={<GroupIcon />} onClick={navigateToGroup} />
                            <IconBtn title="Notifications" icon={<NotificationIcon />} onClick={openNotification} />
                            <IconBtn title="Logout" icon={<LogoutIcon />} onClick={handleLogout} />
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            {
                isSearch && (
                    <Suspense fallback={<Backdrop open />}>
                        <SearchDialog />
                    </Suspense>
                )
            }
            {
                isNotification && (
                    <Suspense fallback={<Backdrop open />}>
                        <NotificationDialog />
                    </Suspense>
                )
            }
            {
                isNewGroup && (
                    <Suspense fallback={<Backdrop open />}>
                        <NewGroupDialog />
                    </Suspense>
                )
            }
        </>
    )
}

export default Header

const IconBtn = ({ title, icon, onClick }) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick}>
                {icon}
            </IconButton>
        </Tooltip>
    )
}