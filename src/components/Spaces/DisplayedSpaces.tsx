// components/Spaces/DisplayedSpaces.tsx
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

import { useSpaces } from "../../hooks/useSpaces";
import { useSpaceOperations } from "../../hooks/useSpaceOperations";
import {
  groupProductsBySpace,
  filterSpacesWithProducts,
} from "../../utils/productGrouping";
import { SpacesGrid } from "./SpacesGrid";
import { SpaceProductsModal } from "./SpaceProductModal";
import { CreateSpaceDialog } from "./CreateSpaceDialog";
import { ImageUploadHandler } from "../../utils/imageUploadHandler";
import { type IRoom } from "../../types";

interface DisplayedSpacesProps {
  refreshTrigger?: number;
}

export const DisplayedSpaces: React.FC<DisplayedSpacesProps> = ({
  refreshTrigger = 0,
}) => {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [openCreateRoomDialog, setOpenCreateRoomDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const { spaces, products, loading, refresh } = useSpaces(refreshTrigger);
  const { createSpace, updateSpaceImage, createProduct } =
    useSpaceOperations(refresh);

  const productsBySpace = groupProductsBySpace(products);
  // Filter out default spaces from categoryIcons
  const customSpaces = spaces.filter((space) => space.dbId);
  const filteredSpaces = filterSpacesWithProducts(
    customSpaces,
    productsBySpace
  );

  const handleSpaceClick = (spaceId: string) => {
    if (spaceId === "Create new room") {
      setOpenCreateRoomDialog(true);
    } else {
      setSelectedSpaceId(spaceId);
    }
  };

  const handleCreateSpace = async () => {
    if (!newRoomName.trim()) return;

    const newSpace = await createSpace(newRoomName);
    if (newSpace) {
      setNewRoomName("");
      setOpenCreateRoomDialog(false);
      setSelectedSpaceId(newSpace.id);
    }
  };

  const handleImageEdit = (space: IRoom) => {
    ImageUploadHandler.handleImageUpload(async (base64Image) => {
      const targetId = space.dbId ?? space.id;
      await updateSpaceImage(targetId, base64Image);
    });
  };

  const handleAddProduct = async () => {
    if (!selectedSpaceId) return;

    const name = prompt("Enter product name:");
    const desc = prompt("Enter product description:");

    if (!name) return;

    await createProduct({
      name,
      desc: desc || "",
      image: "",
      box: selectedSpaceId,
    });
  };

  const selectedSpace = spaces.find((s) => s.id === selectedSpaceId);

  if (loading) return <div>Loading spaces and products...</div>;

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "2rem",
        }}
      >
        <Typography variant="h4">Spaces</Typography>
      </Box>

      <SpacesGrid
        spaces={filteredSpaces}
        selectedSpaceId={selectedSpaceId}
        onSpaceClick={handleSpaceClick}
        onImageEdit={handleImageEdit}
        productsBySpace={productsBySpace}
      />

      <CreateSpaceDialog
        open={openCreateRoomDialog}
        roomName={newRoomName}
        onRoomNameChange={setNewRoomName}
        onClose={() => setOpenCreateRoomDialog(false)}
        onCreate={handleCreateSpace}
      />

      <SpaceProductsModal
        open={!!selectedSpaceId}
        space={selectedSpace}
        products={selectedSpaceId ? productsBySpace[selectedSpaceId] : []}
        onClose={() => setSelectedSpaceId(null)}
        onRefresh={refresh}
        onAddProduct={handleAddProduct}
      />
    </Box>
  );
};

export default DisplayedSpaces;
