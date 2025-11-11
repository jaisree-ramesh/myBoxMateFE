import { useState } from "react";
import { Box, Typography } from "@mui/material";
import Add from "../../assets/icons/add.png";
import ClickableImage from "../../props/ClickableImage";
import ProductRegistrationDialog from "./ProductRegistrationDialog";
import { categoryIcons as initialCategoryIcons } from "../../data";
import { useSpaces } from "../../hooks/useSpaces";
import { useSpaceOperations } from "../../hooks/useSpaceOperations";
import { CreateSpaceDialog } from "./CreateSpaceDialog";
import { normalize } from "../../utils/normalize";

interface ISpace {
  id: string;
  image?: string;
  alt: string;
}

export default function Spaces() {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [openCreateRoomDialog, setOpenCreateRoomDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false); // New state
  const [newRoomName, setNewRoomName] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { loading } = useSpaces(refreshTrigger);
  const { createSpace } = useSpaceOperations(() =>
    setRefreshTrigger((prev) => prev + 1)
  );
  const defaultSpaces = initialCategoryIcons.map((space) => ({
    id: normalize(space.id),
    image: space.image,
    alt: space.alt,
  }));

  const allSpaces: ISpace[] = [
    ...defaultSpaces,
    { id: "Create new room", image: Add, alt: "Create new room" },
  ];

  const handleImageClick = (id: string) => {
    if (id === "Create new room") {
      setOpenCreateRoomDialog(true);
    } else {
      setSelectedSpaceId(id);
      setOpenProductDialog(true); // Open product dialog when space is selected
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    const newSpace = await createSpace(newRoomName);
    if (newSpace) {
      setOpenCreateRoomDialog(false);
      setNewRoomName("");
      setSelectedSpaceId(newSpace.id);
      setOpenProductDialog(true); // Open product dialog after creating room
    }
  };

  const handleProductSave = () => {
    setRefreshTrigger((prev) => prev + 1);
    setOpenProductDialog(false); // Close dialog after saving
  };

  const handleProductDialogClose = () => {
    setOpenProductDialog(false);
    setSelectedSpaceId(null);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography>Loading spaces...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ m: "2rem 0" }} className="spaces-content">
      <Typography variant="h4" gutterBottom>
        Spaces
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Choose a space and start to organize your stuff, or create your own
        space:
      </Typography>

      <Box sx={{ display: "flex" }}>
        <ClickableImage
          data={allSpaces.map((space) => ({
            ...space,
            image: space.image || Add,
          }))}
          onClick={handleImageClick}
        />
      </Box>

      <CreateSpaceDialog
        open={openCreateRoomDialog}
        roomName={newRoomName}
        onRoomNameChange={setNewRoomName}
        onClose={() => setOpenCreateRoomDialog(false)}
        onCreate={handleCreateRoom}
      />

      <ProductRegistrationDialog
        open={openProductDialog}
        spaceId={selectedSpaceId || ""}
        spaceName={
          allSpaces.find((s) => s.id === selectedSpaceId)?.alt ||
          newRoomName ||
          ""
        }
        onClose={handleProductDialogClose}
        onSave={handleProductSave}
      />
    </Box>
  );
}
