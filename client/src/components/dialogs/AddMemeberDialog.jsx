import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { SampleUsers } from '../constants/sampleData'
import UserItem from '../shared/UserItem'

const AddMemeberDialog = ({ addMember, isLoadingAddMember, chatId }) => {

    const [members, setMembers] = useState(SampleUsers)
    const [selectedMembers, setSelectedMembers] = useState([])
    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
    }

    const closeHandler = () => {
        setMembers([])
        setSelectedMembers([])
    }
    const addMemberSubmitHandler = () => { closeHandler()}

    return (
        <Dialog p={'2rem'} open onClose={closeHandler}>
            <Stack p={'2rem'} width={'20rem'} spacing={'2rem'}>
                <DialogTitle textAlign={'center'}>Add Member</DialogTitle>
                <Stack spacing={'1rem'}>
                    {
                        members.length > 0 ? members.map(user => (
                            <UserItem key={user._id} user={user} handler={selectMemberHandler} isAdded = {selectedMembers.includes(user._id)} />
                        )) : <Typography textAlign={'center'}>No friends</Typography>
                    }
                </Stack>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-evenly'}>
                    <Button variant='outlined' onClick={closeHandler} color='error'>Cancel</Button>
                    <Button onClick={addMemberSubmitHandler} variant='contained' disabled={isLoadingAddMember}>Add</Button>
                </Stack>
            </Stack>

        </Dialog>
    )
}

export default AddMemeberDialog