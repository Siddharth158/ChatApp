import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

const ConfirmDeleteDialog = ({open, handleClose, deleteHandler}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>confirm delete</DialogTitle>
        <DialogContent>
            Are you sure want to delete this group !!
        </DialogContent>
        <DialogActions>
            <Button variant='outlined' onClick={handleClose}>No</Button>
            <Button color='error' variant='outlined' onClick={deleteHandler}>Yes</Button>
        </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteDialog