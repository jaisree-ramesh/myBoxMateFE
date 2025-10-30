import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";

interface NewRoomDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (roomData: { id: string; image?: string; alt: string }) => void;
}

export default function NewRoomDialog({
  open,
  onClose,
  onCreate,
}: NewRoomDialogProps) {
  const [roomName, setRoomName] = useState("");

  const handleCreate = () => {
    if (!roomName.trim()) return;

    onCreate({
      id: roomName.trim(), // to generate unique ID
      alt: roomName.trim(),
      image: "",
    });

    setRoomName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Room</DialogTitle>
      <DialogContent>
        <TextField
          label="Room Name"
          fullWidth
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
