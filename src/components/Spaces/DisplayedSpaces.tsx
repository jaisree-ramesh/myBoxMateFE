import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Add from "../../assets/icons/add.png";
import { categoryIcons as initialCategoryIcons } from "../../data";
import { type IItem } from "../../types";


interface IRoom {
  id: string;
  dbId?: string; // original id from DB (used for API calls)
  image?: string;
  alt: string;
}

// Helper to normalize space names - FIXED to be more consistent
const normalize = (s?: string) =>
  s?.trim().toLowerCase().replace(/\s+/g, "-") || "";

interface DisplayedSpacesProps {
  refreshTrigger?: number;
}

export default function DisplayedSpaces({
  refreshTrigger = 0,
}: DisplayedSpacesProps) {
  const [products, setProducts] = useState<IItem[]>([]);
  const [spaces, setSpaces] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [openCreateRoomDialog, setOpenCreateRoomDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  // Initialize default spaces if they don't exist
  const initializeDefaultSpaces = async () => {
    try {
      const spacesRes = await fetch("http://localhost:3000/spaces");
      const existingSpaces = await spacesRes.json();

      // Check which default spaces don't exist yet
      const existingIds = new Set(
        existingSpaces.map((s: IRoom) => normalize(s.id))
      );
      const spacesToAdd = initialCategoryIcons.filter(
        (icon) => !existingIds.has(normalize(icon.id))
      );

      // Add missing spaces
      if (spacesToAdd.length > 0) {
        console.log(
          "Adding default spaces:",
          spacesToAdd.map((s) => s.id)
        );
        await Promise.all(
          spacesToAdd.map((space) =>
            fetch("http://localhost:3000/spaces", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: normalize(space.id), // store normalized id in DB
                image: space.image,
                alt: space.alt,
              }),
            })
          )
        );
      }
    } catch (err) {
      console.error("Error initializing default spaces:", err);
    }
  };

  // ✅ Fetch both products and spaces from json-server
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 Fetching data...");
        // Initialize default spaces first
        await initializeDefaultSpaces();

        const [spacesRes, productsRes] = await Promise.all([
          fetch("http://localhost:3000/spaces"),
          fetch("http://localhost:3000/items"),
        ]);

        if (!spacesRes.ok || !productsRes.ok)
          throw new Error("Failed to fetch data");

        const spacesData: IRoom[] = await spacesRes.json();
        const productsData: IItem[] = await productsRes.json();

        console.log("📦 Raw spaces data:", spacesData);
        console.log("📦 Raw products data:", productsData);

        // Normalize space IDs for consistency and ensure uniqueness
        const usedIds = new Set<string>();
        const normalizedSpaces = spacesData.map((space) => {
          const baseId = normalize(space.id);
          let finalId = baseId;
          let counter = 1;

          // If this ID is already used, add a numeric suffix
          while (usedIds.has(finalId)) {
            finalId = `${baseId}-${counter}`;
            counter++;
          }

          usedIds.add(finalId);

          return {
            ...space,
            // UI id is normalized so it matches products grouping
            id: finalId,
            // keep the original DB id so we can PATCH the correct resource
            dbId: space.id,
            alt: space.alt, // Keep original alt for display
          };
        });

        console.log("🔄 Normalized spaces:", normalizedSpaces);

        // First set products
        setProducts(productsData);

        // Then calculate which spaces have products
        const productsGrouped = productsData.reduce<Record<string, IItem[]>>(
          (acc, product) => {
            const spaceId = normalize(product.box);
            if (!acc[spaceId]) acc[spaceId] = [];
            acc[spaceId].push(product);
            return acc;
          },
          {}
        );

        // Filter spaces that have products and add Create new room card at the beginning
        const spacesWithProducts = normalizedSpaces.filter(
          (space) => productsGrouped[normalize(space.id)]?.length > 0
        );

        setSpaces([
          { id: "Create new room", image: Add, alt: "Create new room" },
          ...spacesWithProducts,
        ]);
        setProducts(productsData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger, refreshCount]);

  // Group products by normalized space ID - FIXED: Normalize product.box too
  const productsBySpace = products.reduce<Record<string, IItem[]>>(
    (acc, product) => {
      const spaceId = normalize(product.box);
      if (!acc[spaceId]) acc[spaceId] = [];
      acc[spaceId].push(product);
      return acc;
    },
    {}
  );

  // Debug: Log the grouping
  console.log("📊 Products by space:", productsBySpace);
  console.log(
    "🏠 Available spaces:",
    spaces.map((s) => ({ id: s.id, alt: s.alt }))
  );

  const handleCardClick = (spaceId: string) => {
    if (spaceId === "Create new room") {
      setOpenCreateRoomDialog(true);
    } else {
      setSelectedSpaceId(spaceId);
    }
  };

  const handleCloseModal = () => setSelectedSpaceId(null);

  // ✅ Create new room and save to db.json
  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    const newRoom: IRoom = {
      id: normalize(newRoomName),
      alt: newRoomName.trim(),
      image: "",
    };

    try {
      const res = await fetch("http://localhost:3000/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });

      if (!res.ok) throw new Error("Failed to save new room");

      const savedRoom = await res.json();

      setSpaces((prev) => [
        ...prev.filter((r) => r.id !== "Create new room"),
        { ...savedRoom, id: normalize(savedRoom.id), dbId: savedRoom.id }, // Ensure normalized and keep dbId
        { id: "Create new room", image: Add, alt: "Create new room" },
      ]);

      setNewRoomName("");
      setOpenCreateRoomDialog(false);
      setSelectedSpaceId(normalize(savedRoom.id));
      setRefreshCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error saving new room:", err);
    }
  };

  // ✅ Add new product to selected room
  const handleAddProduct = async () => {
    const name = prompt("Enter product name:");
    const desc = prompt("Enter product description:");

    if (!name || !selectedSpaceId) return;

    const newProduct: IItem = {
      name,
      desc: desc || "",
      image: "",
      box: selectedSpaceId, // Use the normalized space ID
    };

    try {
      const res = await fetch("http://localhost:3000/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) throw new Error("Failed to save product");

      const saved = await res.json();
      setProducts((prev) => [...prev, saved]);
      setRefreshCount((prev) => prev + 1);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleManualRefresh = () => {
    setLoading(true);
    setRefreshCount((prev) => prev + 1);
  };

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

      {/* Grid of space cards */}
      <Grid container spacing={2}>
        {spaces
          .filter(
            (space) =>
              /* space.id === "Create new room" || */
              productsBySpace[normalize(space.id)]?.length > 0
          )
          .map((space) => (
            <Grid
              key={space.id}
              sx={{
                width: {
                  xs: "100%",
                  sm: "50%",
                  md: "33.333%",
                },

                p: 1,
              }}
            >
              <Card
                sx={{
                  cursor: "pointer",
                  border: space.id === selectedSpaceId ? 2 : 1,
                  borderColor:
                    space.id === selectedSpaceId ? "primary.main" : "grey.300",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    "&:hover .image-overlay": {
                      opacity: 1,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="auto"
                    image={space.image || Add}
                    alt={space.alt}
                    onClick={() => handleCardClick(space.id)}
                  />
                  <Box
                    className="image-overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      opacity: 0,
                      transition: "opacity 0.3s",
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "0 0 0 8px",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = async (e) => {
                              const base64Image = e.target?.result as string;
                              try {
                                // Use original DB id when calling the API (dbId),
                                // fallback to the UI id if dbId is missing
                                const targetId = space.dbId ?? space.id;
                                const res = await fetch(
                                  `http://localhost:3000/spaces/${targetId}`,
                                  {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      image: base64Image,
                                    }),
                                  }
                                );
                                if (res.ok) {
                                  setRefreshCount((prev) => prev + 1);
                                }
                              } catch (err) {
                                console.error("Error updating image:", err);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      sx={{
                        color: "white",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="h6">{space.alt}</Typography>
                  {space.id !== "Create new room" && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      
                      <Typography variant="body2" color="text.secondary">
                        {productsBySpace[space.id]?.length || 0} products
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {space.id}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Dialog to create a new room */}
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
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateRoomDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateRoom}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog showing products for selected space */}
      <Dialog
        open={!!selectedSpaceId}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          {selectedSpaceId
            ? spaces.find((s) => s.id === selectedSpaceId)?.alt
            : ""}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Space ID: {selectedSpaceId} | Products found:{" "}
              {selectedSpaceId
                ? productsBySpace[selectedSpaceId]?.length || 0
                : 0}
            </Typography>
            {selectedSpaceId && productsBySpace[selectedSpaceId] && (
              <Typography variant="caption" color="text.secondary">
                Product boxes:{" "}
                {productsBySpace[selectedSpaceId].map((p) => p.box).join(", ")}
              </Typography>
            )}
          </Box>

          <Grid container spacing={2}>
            {selectedSpaceId &&
              (productsBySpace[selectedSpaceId] || []).map((product) => (
                <Box
                  key={product.name}
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "50%",
                      md: "33.333%",
                    },
                    p: 1,
                  }}
                >
                  <Card>
                    {product.image && (
                      <CardMedia
                        component="img"
                        height="140"
                        image={product.image}
                        alt={product.name}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      {product.desc && (
                        <Typography variant="body2" color="text.secondary">
                          {product.desc}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Box: {product.box} | Normalized:{" "}
                        {normalize(product.box)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
          </Grid>

          {selectedSpaceId &&
            (!productsBySpace[selectedSpaceId] ||
              productsBySpace[selectedSpaceId].length === 0) && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No products in this space yet.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your first product using the button below.
                </Typography>
                {/* <Typography variant="caption" color="text.secondary">
                  Debug: Looking for products with box = "{selectedSpaceId}"
                </Typography> */}
              </Box>
            )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleManualRefresh}>Refresh</Button>
          <Button variant="contained" onClick={handleAddProduct}>
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
