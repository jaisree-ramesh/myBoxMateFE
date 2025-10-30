import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Add from "../../assets/icons/add.png";
import ClickableImage from "../../props/ClickableImage";
import ProductRegistrationDialog from "./ProductRegistrationDialog";
import { categoryIcons as initialCategoryIcons } from "../../data";

interface ISpace {
  id: string;
  image?: string;
  alt: string;
}

const normalize = (s?: string) =>
  s?.trim().toLowerCase().replace(/\s+/g, "-") || "";

export default function Spaces() {
  const [spaces, setSpaces] = useState<ISpace[]>([
    ...initialCategoryIcons.map((space) => ({
      ...space,
      id: normalize(space.id),
    })),
    { id: "Create new room", image: Add, alt: "Create new room" },
  ]);

  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [openCreateRoomDialog, setOpenCreateRoomDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleImageClick = (id: string) => {
    if (id === "Create new room") {
      setOpenCreateRoomDialog(true);
    } else {
      setSelectedSpaceId(id);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    const newSpace: ISpace = {
      id: normalize(newRoomName),
      alt: newRoomName.trim(),
      image: "",
    };

    try {
      const res = await fetch("http://localhost:3000/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSpace),
      });

      if (!res.ok) throw new Error("Failed to save new room");

      const savedSpace = await res.json();

      setSpaces((prev) => [
        ...prev.filter((r) => r.id !== "Create new room"),
        savedSpace,
        { id: "Create new room", image: Add, alt: "Create new room" },
      ]);

      setOpenCreateRoomDialog(false);
      setNewRoomName("");
      setSelectedSpaceId(savedSpace.id);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  const handleProductSave = () => {
    // Trigger refresh in parent component
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <section className="spaces-container container">
      <h1>Spaces</h1>
      <p>Choose a space and start to organize your stuff</p>

      <section className="spaces-content">
        <ClickableImage
          data={spaces.map((space) => ({
            ...space,
            image: space.image || Add, // Use Add icon as fallback
          }))}
          onClick={handleImageClick}
        />
      </section>

      <Dialog
        open={openCreateRoomDialog}
        onClose={() => setOpenCreateRoomDialog(false)}
      >
        <DialogTitle>Create New Room</DialogTitle>
        <DialogContent>
          <TextField
            label="Room Name"
            fullWidth
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleCreateRoom();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateRoomDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateRoom}>
            Create & Register Product
          </Button>
        </DialogActions>
      </Dialog>

      {selectedSpaceId && (
        <ProductRegistrationDialog
          open={!!selectedSpaceId}
          spaceId={selectedSpaceId}
          spaceName={
            spaces.find((s) => s.id === selectedSpaceId)?.alt ||
            newRoomName ||
            ""
          }
          onClose={() => setSelectedSpaceId(null)}
          onSave={handleProductSave}
        />
      )}
    </section>
  );
}
