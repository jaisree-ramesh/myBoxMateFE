import { useState } from "react";
import { Box, Typography, CircularProgress, /* Button */ } from "@mui/material";
/* import AddHomeIcon from "@mui/icons-material/AddHome"; */
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
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { loading } = useSpaces(refreshTrigger);
  const { createSpace } = useSpaceOperations(() =>
    setRefreshTrigger((prev) => prev + 1),
  );

  const defaultSpaces = initialCategoryIcons.map((space) => ({
    id: normalize(space.id),
    image: space.image,
    alt: space.alt,
  }));

  const allSpaces: ISpace[] = [
    ...defaultSpaces,
    /* { id: "Create new room", image: Add, alt: "Create new room" }, */
  ];

  const handleImageClick = (id: string) => {
    if (id === "Create new room") {
      setOpenCreateRoomDialog(true);
    } else {
      setSelectedSpaceId(id);
      setOpenProductDialog(true);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    const newSpace = await createSpace(newRoomName);
    if (newSpace) {
      setOpenCreateRoomDialog(false);
      setNewRoomName("");
      setSelectedSpaceId(newSpace.id);
      setOpenProductDialog(true);
    }
  };

  const handleProductSave = () => {
    setRefreshTrigger((prev) => prev + 1);
    setOpenProductDialog(false);
  };

  const handleProductDialogClose = () => {
    setOpenProductDialog(false);
    setSelectedSpaceId(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "30vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#FFA500" }} />
        <Typography
          sx={{
            color: "#A07850",
            fontSize: "0.9rem",
            letterSpacing: "0.1em",
          }}
        >
          Loading spaces…
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className="spaces-content"
      sx={{
        minHeight: "auto",
        background:
          "linear-gradient(160deg, #1C0F07 0%, #2C1A0E 50%, #1C0F07 100%)",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, sm: 5 },
      }}
    >
      {/* ── Header ── */}
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

          <Typography
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.4rem" },
              fontWeight: 800,
              color: "#F5F5DC",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Spaces
          </Typography>

          <Typography
            sx={{
              mt: 0.75,
              fontSize: "0.85rem",
              color: "#A07850",
              maxWidth: 420,
            }}
          >
            Choose a space to start organising your stuff, or create your own.
          </Typography>
        </Box>

        {/* <Button
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
            flexShrink: 0,
            "&:hover": {
              background: "linear-gradient(135deg, #ffb733 0%, #FFA500 100%)",
              boxShadow: "0 6px 20px rgba(255,165,0,0.45)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          New Space
        </Button> */}
      </Box>

      {/* ── Space icons grid ── */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: "16px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,165,0,0.1)",
        }}
      >
        <Box sx={{ display: "flex", width: "100%", margin: "0 auto" }}>
          <ClickableImage
            data={allSpaces.map((space) => ({
              ...space,
              image: space.image || Add,
            }))}
            onClick={handleImageClick}
          />
        </Box>
      </Box>

      {/* ── Dialogs ── */}
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
