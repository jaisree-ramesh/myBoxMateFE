import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { useSpaces } from "../../hooks/useSpaces";
import { useSpaceOperations } from "../../hooks/useSpaceOperations";
import {
  groupProductsBySpace,
  /* filterSpacesWithProducts, */
} from "../../utils/productGrouping";
import { normalize } from "../../utils/normalize";
import { SpacesGrid } from "./SpacesGrid";
import { SpaceProductsModal } from "./SpaceProductModal";
import { CreateSpaceDialog } from "./CreateSpaceDialog";
import { ImageUploadHandler } from "../../utils/imageUploadHandler";
import { type IRoom, type IBox } from "../../types";

interface DisplayedSpacesProps {
  refreshTrigger?: number;
}

export const DisplayedSpaces: React.FC<DisplayedSpacesProps> = ({
  refreshTrigger = 0,
}) => {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [openCreateRoomDialog, setOpenCreateRoomDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [spaceToDelete, setSpaceToDelete] = useState<IRoom | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // All boxes fetched from /boxes
  const [allBoxes, setAllBoxes] = useState<IBox[]>([]);

  const { spaces, products, loading, refresh } = useSpaces(refreshTrigger);
  const { createSpace, deleteSpace, updateSpaceImage, createProduct } =
    useSpaceOperations(refresh);

  // ── Fetch all boxes ─────────────────────────────────────────────────────────
  const fetchAllBoxes = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/boxes");
      if (!res.ok) return;
      const data: IBox[] = await res.json();
      setAllBoxes(data);
    } catch (err) {
      console.error("Failed to fetch boxes:", err);
    }
  }, []);

  useEffect(() => {
    fetchAllBoxes();
  }, [fetchAllBoxes, refreshTrigger]);

  // ── Group boxes by space (parentId) ─────────────────────────────────────────
  const boxesBySpace = allBoxes.reduce<Record<string, IBox[]>>((acc, box) => {
    const key = box.parentId ?? "";
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(box);
    return acc;
  }, {});

  const productsBySpace = groupProductsBySpace(products);
  const customSpaces = spaces.filter((space) => space.dbId);

  // Show spaces that have at least one box
  const filteredSpaces = customSpaces.filter(
    (space) =>
      (boxesBySpace[space.id]?.length ?? 0) > 0 ||
      (boxesBySpace[space.dbId ?? ""]?.length ?? 0) > 0,
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

  const handleDeleteRequest = (space: IRoom) => {
    setSpaceToDelete(space);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!spaceToDelete) return;
    const success = await deleteSpace(spaceToDelete);
    if (success) {
      if (selectedSpaceId === spaceToDelete.id) setSelectedSpaceId(null);
      fetchAllBoxes(); // refresh box counts after delete
    }
    setDeleteDialogOpen(false);
    setSpaceToDelete(null);
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

  const handleRefresh = () => {
    refresh();
    fetchAllBoxes();
  };

  const selectedSpace = spaces.find((s) => s.id === selectedSpaceId);

  if (loading) return <div>Loading spaces and products...</div>;

  return (
    <Box className="displayed-spaces">
      <Box sx={{ m: "0 0 2rem 0" }}>
        <Typography variant="h5" gutterBottom>
          Used spaces 🗒️
        </Typography>
      </Box>

      <SpacesGrid
        spaces={filteredSpaces}
        selectedSpaceId={selectedSpaceId}
        onSpaceClick={handleSpaceClick}
        onImageEdit={handleImageEdit}
        onDelete={handleDeleteRequest}
        boxesBySpace={boxesBySpace}
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
        products={
          selectedSpaceId
            ? [
                ...(productsBySpace[selectedSpaceId] ?? []),
                ...(selectedSpace?.dbId
                  ? (productsBySpace[normalize(selectedSpace.dbId)] ?? [])
                  : []),
              ].filter(
                (p, i, arr) => arr.findIndex((x) => x._id === p._id) === i,
              )
            : []
        }
        onClose={() => setSelectedSpaceId(null)}
        onRefresh={handleRefresh}
        onAddProduct={handleAddProduct}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSpaceToDelete(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: "#c0392b" }}>Delete Space</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>"{spaceToDelete?.alt}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will permanently delete the space, all its boxes, and all
            products inside it. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setSpaceToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DisplayedSpaces;
