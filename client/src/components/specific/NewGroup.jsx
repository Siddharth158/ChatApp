import { useInputValidation } from "6pp";
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { SampleUsers } from '../constants/sampleData';
import UserItem from '../shared/UserItem';

const NewGroup = () => {
  const groupName = useInputValidation("")
  const [members, setMembers] = useState(SampleUsers)
  const [selectedMembers, setSelectedMembers] = useState([])
  const selectMemberHandler = (id)=>{
    setSelectedMembers((prev)=>prev.includes(id)?prev.filter((i)=> i!== id):[...prev,id])
  }
  const submitHandler = ()=>{}
  const closeHandler = ()=>{}
  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={{ xs: '1rem', sm: '2rem' }} width={'25rem'} spacing={'2rem'}>
        <DialogTitle textAlign={'center'} variant='h4'>New Group</DialogTitle>
        <TextField value={groupName.value} onChange={groupName.changeHandler} label="Group name" />
        <Typography variant='body1' >Members</Typography>
        <Stack>
          {
            members.map((user)=>(
              <UserItem user={user} key={user._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)}
               />
            ))
          }
        </Stack>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Button variant='outlined' size='large' color='error'>Cancel</Button>
          <Button onClick={submitHandler} size='large' variant='contained'>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup