import React, { useState } from "react";
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
  Chip,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QRCodeIcon from "@mui/icons-material/QrCode";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { type IRoom, type IItem } from "../../types";
import ProductRegistrationDialog from "./ProductRegistrationDialog";
import ProductEditDialog from "./ProductEditDialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IItem | null>(null);
  const [productToEdit, setProductToEdit] = useState<IItem | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Close all dialogs when main modal closes
  React.useEffect(() => {
    if (!open) {
      setOpenProductDialog(false);
      setOpenEditDialog(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      setProductToEdit(null);
    }
  }, [open]);

  const handleAddProductClick = () => {
    setOpenProductDialog(true);
  };

  const handleEditClick = (product: IItem) => {
    console.log("🔄 Edit clicked for product:", product);
    console.log("📋 Product ID:", product._id);

    if (!product._id) {
      console.error("❌ Product _id is undefined!", product);
      showSnackbar("Cannot edit product: Missing product ID", "error");
      return;
    }
    setProductToEdit(product);
    setOpenEditDialog(true);
  };

  const handleProductSave = (savedProduct: IItem) => {
    console.log("💾 Handling saved product in modal:", savedProduct);
    console.log("🆔 Saved product has ID:", !!savedProduct._id);

    // The onRefresh() will trigger the useSpaces hook to refetch all data
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

  const handleProductDialogClose = () => {
    setOpenProductDialog(false);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setProductToEdit(null);
  };

  const handleDeleteClick = (product: IItem) => {
    console.log("🗑️ Delete clicked for product:", product);
    console.log("📋 Product ID:", product._id);

    if (!product._id) {
      console.error("❌ Product _id is undefined!", product);
      showSnackbar("Cannot delete product: Missing product ID", "error");
      return;
    }
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete?._id) {
      showSnackbar("Cannot delete product: Missing product ID", "error");
      return;
    }

    try {
      console.log("🚀 Deleting product with ID:", productToDelete._id);

      const res = await fetch(
        `http://localhost:3000/items/${productToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Delete failed:", res.status, errorText);
        throw new Error(`Failed to delete product: ${res.status} ${errorText}`);
      }

      console.log("✅ Product deleted successfully");
      onRefresh();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      showSnackbar("Product deleted successfully!", "success");
    } catch (err) {
      console.error("❌ Error deleting product:", err);
      showSnackbar("Failed to delete product. Please try again.", "error");
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString();
  };

  // Determine if we should show the main modal
  const showMainModal =
    open && !deleteDialogOpen && !openEditDialog && !openProductDialog;

  if (!open) return null;

  return (
    <>
      {/* Main Box Modal - Only show when no dialogs are open */}
      {showMainModal && (
        <section className="modal-overlay" onClick={onClose}>
          <div className="wood-box" onClick={(e) => e.stopPropagation()}>
            <div className="box-base"></div>
            <div className="box-lid box-lid-top"></div>
            <div className="box-lid box-lid-left"></div>
            <div className="box-lid box-lid-right"></div>
            <div className="box-lid box-lid-front"></div>
            <div className="box-content">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5" component="h2" color="#F5F5DC">
                  {space?.alt || ""}
                </Typography>
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{
                    color: "#F5F5DC",
                    "&:hover": {
                      backgroundColor: "rgba(245, 245, 220, 0.1)",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="#F5F5DC">
                  Products found: {products.length}
                </Typography>
              </Box>

              {/* Products grid */}
              <Box sx={{ maxHeight: "400px", overflow: "auto", mb: 2 }}>
                <Grid container spacing={2}>
                  {products.map((product) => (
                    <Grid
                      item
                      key={product._id || `no-id-${product.name}`}
                      xs={12}
                      sm={6}
                      md={4}
                    >
                      <Card
                        sx={{
                          position: "relative",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          "&:hover .action-button": {
                            opacity: 1,
                          },
                          border: !product._id ? "2px solid red" : "none",
                        }}
                      >
                        {/* Action buttons */}
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
                          {/* Edit button */}
                          <IconButton
                            className="action-button"
                            onClick={() => handleEditClick(product)}
                            disabled={!product._id}
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              opacity: product._id ? 0.7 : 0.3,
                              transition: "opacity 0.2s",
                              "&:hover": {
                                backgroundColor: product._id
                                  ? "#e3f2fd"
                                  : "rgba(255, 255, 255, 0.9)",
                                opacity: product._id ? 1 : 0.3,
                              },
                            }}
                            title={
                              product._id
                                ? "Edit product"
                                : "Cannot edit - missing ID"
                            }
                          >
                            <EditIcon
                              color={product._id ? "primary" : "disabled"}
                              fontSize="small"
                            />
                          </IconButton>

                          {/* Delete button */}
                          <IconButton
                            className="action-button"
                            onClick={() => handleDeleteClick(product)}
                            disabled={!product._id}
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              opacity: product._id ? 0.7 : 0.3,
                              transition: "opacity 0.2s",
                              "&:hover": {
                                backgroundColor: product._id
                                  ? "#ffebee"
                                  : "rgba(255, 255, 255, 0.9)",
                                opacity: product._id ? 1 : 0.3,
                              },
                            }}
                            title={
                              product._id
                                ? "Delete product"
                                : "Cannot delete - missing ID"
                            }
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
                            {!product._id && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ ml: 1 }}
                              >
                                (No ID)
                              </Typography>
                            )}
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

                          {/* Additional product information */}
                          <Stack spacing={1} sx={{ mt: "auto" }}>
                            {/* Box location */}
                            {product.box && (
                              <Chip
                                label={`Box: ${product.box}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.7rem" }}
                              />
                            )}

                            {/* ID display for debugging */}
                            {product._id && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  fontFamily: "monospace",
                                  fontSize: "0.6rem",
                                  wordBreak: "break-all",
                                }}
                              >
                                ID: {product._id}
                              </Typography>
                            )}

                            {/* QR Code indicator */}
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

                            {/* Collaborators */}
                            {product.collaborators &&
                              product.collaborators.length > 0 && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <PeopleIcon fontSize="small" color="action" />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {product.collaborators.length} collaborator
                                    {product.collaborators.length !== 1
                                      ? "s"
                                      : ""}
                                  </Typography>
                                </Box>
                              )}

                            {/* Creation date */}
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

                            {/* Last updated */}
                            {product.updatedAt &&
                              product.updatedAt !== product.createdAt && (
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
                                    Updated: {formatDate(product.updatedAt)}
                                  </Typography>
                                </Box>
                              )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {products.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="#F5F5DC">
                      No products in this space yet.
                    </Typography>
                    <Typography variant="body2" color="#F5F5DC" sx={{ mt: 1 }}>
                      Add your first product using the button below.
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  pt: 2,
                  borderTop: "1px solid #FFA500",
                }}
              >
                <Button
                  onClick={onRefresh}
                  variant="outlined"
                  sx={{ color: "#FFA500", borderColor: "#FFA500" }}
                >
                  Refresh
                </Button>
                <Button
                  onClick={handleAddProductClick}
                  variant="contained"
                  sx={{ backgroundColor: "#FFA500", color: "#391D07" }}
                >
                  Add Product
                </Button>
              </Box>
            </div>
          </div>
        </section>
      )}

      {/* Product Registration Dialog */}
      <ProductRegistrationDialog
        open={openProductDialog}
        spaceId={space?.id || ""}
        spaceName={space?.alt || ""}
        onClose={handleProductDialogClose}
        onSave={handleProductSave} // Now this receives the complete product with _id
      />

      {/* Product Edit Dialog */}
      <ProductEditDialog
        open={openEditDialog}
        product={productToEdit}
        spaceId={space?.id || ""}
        spaceName={space?.alt || ""}
        onClose={handleEditDialogClose}
        onSave={handleProductEditSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        disableScrollLock={false}
        keepMounted={false}
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{productToDelete?.name}"? This
            action cannot be undone.
          </Typography>
          {productToDelete?.desc && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Description: {productToDelete.desc}
            </Typography>
          )}
          {productToDelete?._id && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block", fontFamily: "monospace" }}
            >
              ID: {productToDelete._id}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
