import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Snackbar,
  Alert,
  Badge,
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QRCodeIcon from "@mui/icons-material/QrCode";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { type IRoom, type IItem, type IBox } from "../../types";
import ProductRegistrationDialog from "./ProductRegistrationDialog";
import ProductEditDialog from "./ProductEditDialog";
import CreateBoxDialog from "./CreateBoxDialog";
import { API_BASE, authHeaders } from "../../config/api";

interface SpaceProductsModalProps {
  open: boolean;
  space: IRoom | undefined;
  products: IItem[];
  onClose: () => void;
  onRefresh: () => void;
  onAddProduct: () => void;
}

export const SpaceProductsModal: React.FC<SpaceProductsModalProps> = ({
  open,
  space,
  products,
  onClose,
  onRefresh,
}) => {
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCreateBoxDialog, setOpenCreateBoxDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IItem | null>(null);
  const [productToEdit, setProductToEdit] = useState<IItem | null>(null);
  const [selectedBox, setSelectedBox] = useState<IBox | null>(null);

  const [boxes, setBoxes] = useState<IBox[]>([]);
  const [boxesLoading, setBoxesLoading] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  // ── Fetch boxes for this space ──────────────────────────────────────────────
  const fetchBoxes = useCallback(async () => {
    if (!space?.dbId && !space?.id) return;
    setBoxesLoading(true);
    try {
      // Use dbId (real MongoDB ObjectId) for the query
      const spaceId = space.dbId ?? space.id;
      const res = await fetch(`${API_BASE}/boxes?parentId=${spaceId}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch boxes");
      const data: IBox[] = await res.json();
      // MongoDB returns id already transformed by the route
      setBoxes(data.map((b) => ({ ...b, _id: b.id })));
    } catch (err) {
      console.error("Error fetching boxes:", err);
      showSnackbar("Failed to load boxes.", "error");
    } finally {
      setBoxesLoading(false);
    }
  }, [space?.dbId, space?.id]);

  useEffect(() => {
    if (open) fetchBoxes();
  }, [open, fetchBoxes]);

  useEffect(() => {
    if (!open) {
      setOpenProductDialog(false);
      setOpenEditDialog(false);
      setOpenCreateBoxDialog(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      setProductToEdit(null);
      setSelectedBox(null);
      setBoxes([]);
    }
  }, [open]);

  const selectedBoxProducts = selectedBox
    ? products.filter(
        (p) => p.box === selectedBox.id || p.box === selectedBox._id,
      )
    : [];

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleBoxCreated = (box: IBox) => {
    setBoxes((prev) => [...prev, box]);
    showSnackbar(`Box "${box.name}" created!`, "success");
  };

  const handleEditClick = (product: IItem) => {
    if (!product._id) {
      showSnackbar("Cannot edit product: Missing product ID", "error");
      return;
    }
    setProductToEdit(product);
    setOpenEditDialog(true);
  };

  const handleProductSave = () => {
    onRefresh();
    setOpenProductDialog(false);
    showSnackbar("Product added successfully!", "success");
  };

  const handleProductEditSave = () => {
    onRefresh();
    setOpenEditDialog(false);
    setProductToEdit(null);
    showSnackbar("Product updated successfully!", "success");
  };

  const handleDeleteClick = (product: IItem) => {
    if (!product._id) {
      showSnackbar("Cannot delete product: Missing product ID", "error");
      return;
    }
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete?._id) return;
    try {
      const res = await fetch(`${API_BASE}/items/${productToDelete._id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      onRefresh();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      showSnackbar("Product deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting product:", err);
      showSnackbar("Failed to delete product. Please try again.", "error");
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") =>
    setSnackbar({ open: true, message, severity });

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString();
  };

  const showMainModal =
    open &&
    !deleteDialogOpen &&
    !openEditDialog &&
    !openProductDialog &&
    !openCreateBoxDialog;

  if (!open) return null;

  return (
    <>
      {showMainModal && (
        <section className="modal-overlay" onClick={onClose}>
          <div className="wood-box" onClick={(e) => e.stopPropagation()}>
            <div className="box-base"></div>
            <div className="box-lid box-lid-top"></div>
            <div className="box-lid box-lid-left"></div>
            <div className="box-lid box-lid-right"></div>
            <div className="box-lid box-lid-front"></div>
            <div className="box-content">
              {/* ── Header ── */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {selectedBox && (
                    <IconButton
                      onClick={() => setSelectedBox(null)}
                      sx={{ color: "#F5F5DC", p: 0.5 }}
                      title="Back to boxes"
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  )}
                  {selectedBox ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: selectedBox.color ?? "#D97706",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                        }}
                      >
                        {selectedBox.icon ?? "📦"}
                      </Box>
                      <Typography variant="h5" component="h2" color="#F5F5DC">
                        {selectedBox.name}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="h5" component="h2" color="#F5F5DC">
                      {space?.alt || ""}
                    </Typography>
                  )}
                </Box>
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{
                    color: "#F5F5DC",
                    "&:hover": { backgroundColor: "rgba(245,245,220,0.1)" },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* ── Subtitle ── */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="#F5F5DC">
                  {selectedBox
                    ? `${selectedBoxProducts.length} product${selectedBoxProducts.length !== 1 ? "s" : ""} in this box`
                    : `${boxes.length} box${boxes.length !== 1 ? "es" : ""} · ${products.length} total product${products.length !== 1 ? "s" : ""}`}
                </Typography>
              </Box>

              {/* ══ BOX LIST VIEW ══ */}
              {!selectedBox && (
                <Box sx={{ maxHeight: "400px", overflow: "auto", mb: 2 }}>
                  <Grid container spacing={2}>
                    {boxesLoading &&
                      [1, 2, 3].map((n) => (
                        <Grid key={n} size={{ xs: 12, sm: 6, md: 4 }}>
                          <Skeleton
                            variant="rounded"
                            height={140}
                            sx={{
                              borderRadius: 2,
                              bgcolor: "rgba(255,255,255,0.08)",
                            }}
                          />
                        </Grid>
                      ))}

                    {!boxesLoading &&
                      boxes.map((box) => {
                        const itemCount = products.filter(
                          (p) => p.box === box.id || p.box === box._id,
                        ).length;
                        return (
                          <Grid
                            key={box.id ?? box._id}
                            size={{ xs: 12, sm: 6, md: 4 }}
                          >
                            <Card
                              onClick={() => setSelectedBox(box)}
                              sx={{
                                cursor: "pointer",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                py: 3,
                                px: 2,
                                background:
                                  "linear-gradient(135deg, #5C3A1E 0%, #3E2310 100%)",
                                border: `2px solid ${box.color ?? "#8B5E3C"}`,
                                borderRadius: 2,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                                  transform: "translateY(-3px)",
                                  filter: "brightness(1.1)",
                                },
                              }}
                            >
                              <Badge
                                badgeContent={itemCount}
                                color="warning"
                                sx={{ mb: 1.5 }}
                              >
                                <Box
                                  sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: "50%",
                                    background: box.color ?? "#D97706",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 28,
                                  }}
                                >
                                  {box.icon ?? "📦"}
                                </Box>
                              </Badge>
                              <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                color="#F5F5DC"
                                textAlign="center"
                                sx={{ wordBreak: "break-word", mt: 0.5 }}
                              >
                                {box.name}
                              </Typography>
                              {box.desc && (
                                <Typography
                                  variant="caption"
                                  color="#A07850"
                                  textAlign="center"
                                  sx={{ mt: 0.25, px: 1 }}
                                >
                                  {box.desc}
                                </Typography>
                              )}
                              <Typography
                                variant="caption"
                                color="#A07850"
                                sx={{ mt: 0.5 }}
                              >
                                {itemCount} item{itemCount !== 1 ? "s" : ""}
                              </Typography>
                            </Card>
                          </Grid>
                        );
                      })}

                    {!boxesLoading && (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                          onClick={() => setOpenCreateBoxDialog(true)}
                          sx={{
                            cursor: "pointer",
                            height: "100%",
                            minHeight: 140,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 3,
                            px: 2,
                            background: "transparent",
                            border: "2px dashed #FFA500",
                            borderRadius: 2,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background: "rgba(255,165,0,0.08)",
                              transform: "translateY(-3px)",
                            },
                          }}
                        >
                          <AddIcon
                            sx={{ fontSize: 36, color: "#FFA500", mb: 1 }}
                          />
                          <Typography
                            variant="subtitle2"
                            color="#FFA500"
                            fontWeight={700}
                          >
                            New Box
                          </Typography>
                          <Typography
                            variant="caption"
                            color="#A07850"
                            textAlign="center"
                          >
                            Create a new container
                          </Typography>
                        </Card>
                      </Grid>
                    )}
                  </Grid>

                  {!boxesLoading && boxes.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 6 }}>
                      <Typography fontSize={56}>📦</Typography>
                      <Typography
                        variant="body1"
                        color="#F5F5DC"
                        sx={{ mt: 1 }}
                      >
                        No boxes yet in this space.
                      </Typography>
                      <Typography
                        variant="body2"
                        color="#A07850"
                        sx={{ mt: 0.5 }}
                      >
                        Create a box to start organising your products.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* ══ PRODUCTS INSIDE A BOX VIEW ══ */}
              {selectedBox && (
                <Box sx={{ maxHeight: "400px", overflow: "auto", mb: 2 }}>
                  <Grid container spacing={2}>
                    {selectedBoxProducts.map((product) => (
                      <Grid
                        key={product._id || `no-id-${product.name}`}
                        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                      >
                        <Card
                          sx={{
                            position: "relative",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            "&:hover .action-button": { opacity: 1 },
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              display: "flex",
                              gap: 0.5,
                              zIndex: 1,
                            }}
                          >
                            <IconButton
                              className="action-button"
                              onClick={() => handleEditClick(product)}
                              disabled={!product._id}
                              sx={{
                                backgroundColor: "rgba(255,255,255,0.9)",
                                opacity: product._id ? 0.7 : 0.3,
                                transition: "opacity 0.2s",
                                "&:hover": {
                                  backgroundColor: "#e3f2fd",
                                  opacity: 1,
                                },
                              }}
                            >
                              <EditIcon
                                color={product._id ? "primary" : "disabled"}
                                fontSize="small"
                              />
                            </IconButton>
                            <IconButton
                              className="action-button"
                              onClick={() => handleDeleteClick(product)}
                              disabled={!product._id}
                              sx={{
                                backgroundColor: "rgba(255,255,255,0.9)",
                                opacity: product._id ? 0.7 : 0.3,
                                transition: "opacity 0.2s",
                                "&:hover": {
                                  backgroundColor: "#ffebee",
                                  opacity: 1,
                                },
                              }}
                            >
                              <DeleteIcon
                                color={product._id ? "error" : "disabled"}
                                fontSize="small"
                              />
                            </IconButton>
                          </Box>

                          {product.image && (
                            <CardMedia
                              component="img"
                              height="140"
                              image={product.image}
                              alt={product.name}
                              sx={{ objectFit: "cover" }}
                            />
                          )}

                          <CardContent sx={{ flexGrow: 1, p: 2 }}>
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{ pr: 8, mb: 1 }}
                            >
                              {product.name}
                            </Typography>
                            {product.desc && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                              >
                                {product.desc}
                              </Typography>
                            )}
                            <Stack spacing={1} sx={{ mt: "auto" }}>
                              {product.qrCode && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <QRCodeIcon fontSize="small" color="action" />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    QR Code Available
                                  </Typography>
                                </Box>
                              )}
                              {product.collaborators &&
                                product.collaborators.length > 0 && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 0.5,
                                    }}
                                  >
                                    <PeopleIcon
                                      fontSize="small"
                                      color="action"
                                    />
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {product.collaborators.length}{" "}
                                      collaborator
                                      {product.collaborators.length !== 1
                                        ? "s"
                                        : ""}
                                    </Typography>
                                  </Box>
                                )}
                              {product.createdAt && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <CalendarTodayIcon
                                    fontSize="small"
                                    color="action"
                                  />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Added: {formatDate(product.createdAt)}
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}

                    {/* Add product card */}
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                      <Card
                        onClick={() => setOpenProductDialog(true)}
                        sx={{
                          cursor: "pointer",
                          height: "100%",
                          minHeight: 160,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "transparent",
                          border: `2px dashed ${selectedBox.color ?? "#FFA500"}`,
                          borderRadius: 2,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: `${selectedBox.color ?? "#FFA500"}11`,
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <AddIcon
                          sx={{
                            fontSize: 32,
                            color: selectedBox.color ?? "#FFA500",
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color={selectedBox.color ?? "#FFA500"}
                          fontWeight={700}
                        >
                          Add Product
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>

                  {selectedBoxProducts.length === 0 && (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography fontSize={40}>
                        {selectedBox.icon ?? "📦"}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="#F5F5DC"
                        sx={{ mt: 1 }}
                      >
                        No products in this box yet.
                      </Typography>
                      <Typography variant="body2" color="#A07850">
                        Click "Add Product" to get started.
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* ── Footer ── */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  pt: 2,
                  borderTop: "1px solid #FFA500",
                  "@media (max-width: 576px)": { justifyContent: "center" },
                }}
              >
                <Button
                  onClick={() => {
                    onRefresh();
                    fetchBoxes();
                  }}
                  variant="outlined"
                  sx={{ color: "#FFA500", borderColor: "#FFA500" }}
                >
                  Refresh
                </Button>
                {selectedBox && (
                  <Button
                    onClick={() => setSelectedBox(null)}
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{ color: "#F5F5DC", borderColor: "#8B5E3C" }}
                  >
                    All Boxes
                  </Button>
                )}
                {selectedBox ? (
                  <Button
                    onClick={() => setOpenProductDialog(true)}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      background: selectedBox.color ?? "#FFA500",
                      color: "#fff",
                    }}
                  >
                    Add Product
                  </Button>
                ) : (
                  <Button
                    onClick={() => setOpenCreateBoxDialog(true)}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: "#FFA500", color: "#391D07" }}
                  >
                    New Box
                  </Button>
                )}
              </Box>
            </div>
          </div>
        </section>
      )}

      <CreateBoxDialog
        open={openCreateBoxDialog}
        spaceId={space?.dbId ?? space?.id ?? ""}
        spaceName={space?.alt || ""}
        onClose={() => setOpenCreateBoxDialog(false)}
        onSave={handleBoxCreated}
      />

      <ProductRegistrationDialog
        open={openProductDialog}
        spaceId={space?.dbId ?? space?.id ?? ""}
        spaceName={space?.alt || ""}
        defaultBox={selectedBox?.id ?? undefined}
        onClose={() => setOpenProductDialog(false)}
        onSave={() => handleProductSave()}
      />

      {openEditDialog && productToEdit && (
        <ProductEditDialog
          open={openEditDialog}
          product={productToEdit}
          spaceId={space?.dbId ?? space?.id ?? ""}
          spaceName={space?.alt || ""}
          onClose={() => {
            setOpenEditDialog(false);
            setProductToEdit(null);
          }}
          onSave={handleProductEditSave}
        />
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #3E2310 0%, #2C1A0E 100%)",
            border: "1px solid rgba(255,165,0,0.2)",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#e74c3c", fontWeight: 700 }}>
          🗑️ Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#F5F5DC" }}>
            Are you sure you want to delete{" "}
            <Box component="strong" sx={{ color: "#FFA500" }}>
              "{productToDelete?.name}"
            </Box>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setProductToDelete(null);
            }}
            sx={{ color: "#A07850", textTransform: "none" }}
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
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
