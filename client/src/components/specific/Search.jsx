import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../shared/UserItem';
import { SampleUsers } from '../constants/sampleData';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery } from '../../redux/api/api';


const Search = () => {
  const search = useInputValidation('');
  const {isSearch} = useSelector(state=>state.misc);
  const dispatch = useDispatch();

  const [searchUser] = useLazySearchUserQuery()

  const [users,setUsers] = useState([])
  const addFriendHandler = (id)=>{
    console.log(id);
  }

  const searchCloseHandler = ()=>{
    dispatch(setIsSearch(false))
  }

  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      searchUser(search.value)
      .then(({data})=>{
        setUsers(data.users)
        console.log(data.users)
      })
      .catch((err)=>console.log(err));
    },1000)
    return ()=> {clearTimeout(timeOutId)}
  },[search.value])

  let isLoadingFriendRequest = false;
  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack padding={'2rem'} width={'25rem'} >
        <DialogTitle>Find Peaople</DialogTitle>
        <TextField label=""
          value={search.value}
          onChange={search.changeHandler}
          variant='outlined'
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            )
          }} />

        <List>
          {
            users.map((user)=>(
              <UserItem user={user} key={user._id} handler={addFriendHandler}
              handlerIsLoading={isLoadingFriendRequest} />
            ))
          }
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search