import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../shared/UserItem';
import { SampleUsers } from '../constants/sampleData';


const Search = () => {
  const search = useInputValidation('');
  const [users,setUsers] = useState(SampleUsers)
  const addFriendHandler = (id)=>{
    console.log(id);
  }
  let isLoadingFriendRequest = false;
  return (
    <Dialog open>
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