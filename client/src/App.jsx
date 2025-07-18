import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from './components/auth/ProtectRoute';
import { LayoutLoader } from './components/layout/Loader';

import axios from 'axios'
import { server } from './components/constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { userExists, userNotExists } from './redux/reducers/auth';
import { Toaster } from 'react-hot-toast'
import { SocketProvider } from './socket';

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"))
const Chat = lazy(() => import("./pages/Chat"))
const Groups = lazy(() => import("./pages/Groups"))
const NotFound = lazy(() => import("./pages/NotFound"))

function App() {

  const { user, loader } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  useEffect(() => {
    axios.get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then((res) => {
        // console.log(res)
        dispatch(userExists(res.data.user))
      })
      .catch(err => dispatch(userNotExists()))
  }, [])
  return loader ? <LayoutLoader /> : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={
            <SocketProvider>
              <ProtectRoute user={user} />
            </SocketProvider>}>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
          <Route path="/login" element={
            <ProtectRoute user={!user} redirect='/'>
              <Login />
            </ProtectRoute>}
          />
          <Route path='*' element={<NotFound />} />

        </Routes>
      </Suspense>
      <Toaster position='bottom-center' />
    </BrowserRouter>
  )
}

export default App