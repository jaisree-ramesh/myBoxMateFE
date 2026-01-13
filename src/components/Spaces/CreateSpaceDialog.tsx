import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface CreateSpaceDialogProps {
  open: boolean;
  roomName: string;
  onRoomNameChange: (name: string) => void;
  onClose: () => void;
  onCreate: () => void;
}

export const CreateSpaceDialog: React.FC<CreateSpaceDialogProps> = ({
  open,
  roomName,
  onRoomNameChange,
  onClose,
  onCreate,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCreate();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Room</DialogTitle>
      <DialogContent>
        <TextField
          label="Room Name"
          fullWidth
          value={roomName}
          onChange={(e) => onRoomNameChange(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={onCreate}
          disabled={!roomName.trim()}
        >
          Create & Register Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};