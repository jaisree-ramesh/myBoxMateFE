// components/Spaces/SpaceProductsModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { type IRoom, type IItem } from "../../types";

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
  onAddProduct,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {space?.alt || ""}
        <IconButton
          aria-label="close"
          onClick={onClose}
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
            Space ID: {space?.id} | Products found: {products.length}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {products.map((product) => (
            <Box
              key={product.name}
              sx={{ width: { xs: "100%", sm: "50%", md: "33.333%" }, p: 1 }}
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
                </CardContent>
              </Card>
            </Box>
          ))}
        </Grid>

        {products.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No products in this space yet.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add your first product using the button below.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onRefresh}>Refresh</Button>
        <Button variant="contained" onClick={onAddProduct}>
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};
