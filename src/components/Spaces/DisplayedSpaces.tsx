import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import AddHomeIcon from "@mui/icons-material/AddHome";

import { useSpaces } from "../../hooks/useSpaces";
import { useSpaceOperations } from "../../hooks/useSpaceOperations";
import { groupProductsBySpace } from "../../utils/productGrouping";
import { normalize } from "../../utils/normalize";
import { SpacesGrid } from "./SpacesGrid";
import { SpaceProductsModal } from "./SpaceProductModal";
import { CreateSpaceDialog } from "./CreateSpaceDialog";
import { ImageUploadHandler } from "../../utils/imageUploadHandler";
import { type IRoom, type IBox } from "../../types";
import { API_BASE, authHeaders } from "../../config/api";

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
  const [allBoxes, setAllBoxes] = useState<IBox[]>([]);

  const { spaces, products, loading, refresh } = useSpaces(refreshTrigger);
  const { createSpace, deleteSpace, updateSpaceImage, createProduct } =
    useSpaceOperations(refresh);

  const fetchAllBoxes = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/boxes`, { headers: authHeaders() });
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

  const boxesBySpace = allBoxes.reduce<Record<string, IBox[]>>((acc, box) => {
    const key = box.parentId ?? "";
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(box);
    return acc;
  }, {});

  const productsBySpace = groupProductsBySpace(products);
  const customSpaces = spaces.filter((space) => space.dbId);
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
      fetchAllBoxes();
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

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "40vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#FFA500" }} />
        <Typography
          sx={{ color: "#A07850", fontSize: "0.9rem", letterSpacing: "0.1em" }}
        >
          Loading your spaces…
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className="displayed-spaces"
      sx={{
        minHeight: "auto",
        background:
          "linear-gradient(160deg, #1C0F07 0%, #2C1A0E 50%, #1C0F07 100%)",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, sm: 5 },
      }}
    >
      {/* ── Page header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          mb: 4,
          pb: 3,
          borderBottom: "1px solid rgba(255,165,0,0.2)",
        }}
      >
        <Box>
          {/* Eyebrow label */}
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#FFA500",
              mb: 0.5,
            }}
          >
            My BoxMate
          </Typography>

          {/* Main heading */}
          <Typography
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.4rem" },
              fontWeight: 800,
              color: "#F5F5DC",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Your Spaces
          </Typography>

          {/* Subheading */}
          <Typography
            sx={{
              mt: 0.75,
              fontSize: "0.85rem",
              color: "#A07850",
              letterSpacing: "0.03em",
            }}
          >
            {filteredSpaces.length} space
            {filteredSpaces.length !== 1 ? "s" : ""} · {allBoxes.length} box
            {allBoxes.length !== 1 ? "es" : ""} · {products.length} item
            {products.length !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {/* Create space button */}
        <Button
          onClick={() => setOpenCreateRoomDialog(true)}
          startIcon={<AddHomeIcon />}
          variant="contained"
          sx={{
            background: "linear-gradient(135deg, #FFA500 0%, #e08c00 100%)",
            color: "#1C0F07",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
            px: 2.5,
            py: 1.25,
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(255,165,0,0.3)",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #ffb733 0%, #FFA500 100%)",
              boxShadow: "0 6px 20px rgba(255,165,0,0.45)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          New Space
        </Button>
      </Box>

      {/* ── Spaces grid ── */}
      <SpacesGrid
        spaces={filteredSpaces}
        selectedSpaceId={selectedSpaceId}
        onSpaceClick={handleSpaceClick}
        onImageEdit={handleImageEdit}
        onDelete={handleDeleteRequest}
        boxesBySpace={boxesBySpace}
      />

      {/* ── Empty state ── */}
      {filteredSpaces.length === 0 && (
        <Box
          sx={{
            mt: 4,
            py: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderRadius: "20px",
            border: "2px dashed rgba(255,165,0,0.25)",
            background: "rgba(255,165,0,0.03)",
          }}
        >
          <Typography sx={{ fontSize: 64, lineHeight: 1 }}>🏠</Typography>
          <Typography
            sx={{ color: "#F5F5DC", fontWeight: 700, fontSize: "1.3rem" }}
          >
            No spaces yet
          </Typography>
          <Typography
            sx={{
              color: "#A07850",
              fontSize: "0.9rem",
              textAlign: "center",
              maxWidth: 300,
            }}
          >
            Create a space, add boxes inside it, then register your items.
          </Typography>
          <Button
            onClick={() => setOpenCreateRoomDialog(true)}
            variant="outlined"
            sx={{
              mt: 1,
              color: "#FFA500",
              borderColor: "#FFA500",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { background: "rgba(255,165,0,0.08)" },
            }}
          >
            Create your first space
          </Button>
        </Box>
      )}

      {/* ── Dialogs ── */}
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

      {/* ── Delete confirmation ── */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSpaceToDelete(null);
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #3E2310 0%, #2C1A0E 100%)",
            border: "1px solid rgba(255,165,0,0.2)",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#e74c3c",
            fontWeight: 700,
            borderBottom: "1px solid rgba(255,165,0,0.1)",
          }}
        >
          🗑️ Delete Space
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ color: "#F5F5DC" }}>
            Are you sure you want to delete{" "}
            <Box component="strong" sx={{ color: "#FFA500" }}>
              "{spaceToDelete?.alt}"
            </Box>
            ?
          </Typography>
          <Typography variant="body2" sx={{ color: "#A07850", mt: 1.5 }}>
            This will permanently delete the space, all its boxes, and all
            products inside it. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setSpaceToDelete(null);
            }}
            sx={{
              color: "#A07850",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { background: "rgba(255,255,255,0.05)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #c0392b 0%, #922b21 100%)",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DisplayedSpaces;
