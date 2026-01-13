import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import { type IItem } from "../../types";

interface ProductEditDialogProps {
  open: boolean;
  product: IItem | null;
  spaceId: string;
  spaceName: string;
  onClose: () => void;
  onSave: () => void;
}

export default function ProductEditDialog({
  open,
  product,
  spaceId,
  spaceName,
  onClose,
  onSave,
}: ProductEditDialogProps) {
  const [formData, setFormData] = useState<Partial<IItem>>({});
  const [collaboratorInput, setCollaboratorInput] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when product changes
  useEffect(() => {
    if (product && product._id) {
      console.log("📦 Initializing edit form with product:", product);
      console.log("🆔 Product ID:", product._id);
      setFormData({
        ...product,
      });
      setPreview(product.image || null);
      setError(null);
    } else if (product && !product._id) {
      console.error("❌ Product has no _id:", product);
      setError("Cannot edit product: Missing product ID");
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setFormData((prev) => ({
          ...prev,
          image: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCollaboratorAdd = () => {
    if (
      collaboratorInput.trim() &&
      !formData.collaborators?.includes(collaboratorInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        collaborators: [
          ...(prev.collaborators || []),
          collaboratorInput.trim(),
        ],
      }));
      setCollaboratorInput("");
    }
  };

  const handleCollaboratorDelete = (collaboratorToDelete: string) => {
    setFormData((prev) => ({
      ...prev,
      collaborators:
        prev.collaborators?.filter((c) => c !== collaboratorToDelete) || [],
    }));
  };

  const handleCollaboratorKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCollaboratorAdd();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product?._id) {
      setError("Cannot update: Product ID is missing");
      console.error("❌ Product ID is undefined in handleSubmit");
      return;
    }

    if (!formData.name?.trim()) {
      setError("Product name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare update data
      const updateData = {
        name: formData.name.trim(),
        desc: formData.desc?.trim() || "",
        box: formData.box || "",
        image: formData.image || "",
        collaborators: formData.collaborators || [],
        updatedAt: new Date().toISOString(),
      };

      console.log("🔄 Updating product:", {
        productId: product._id,
        updateData: updateData,
      });

      const res = await fetch(`http://localhost:3000/items/${product._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      console.log("📡 Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Server error:", errorText);
        throw new Error(`Failed to update product: ${res.status}`);
      }

      const updatedProduct = await res.json();
      console.log("✅ Product updated successfully:", updatedProduct);

      onSave(); // Refresh the parent component
      onClose(); // Close the dialog
    } catch (err) {
      console.error("❌ Error updating product:", err);
      setError(
        `Failed to update product: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFormData({});
      setCollaboratorInput("");
      setPreview(null);
      setLoading(false);
      setError(null);
    }
  }, [open]);

  if (!product) {
    console.log("❌ No product provided to edit dialog");
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Product: {product.name}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} id="edit-product-form">
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Space: <strong>{spaceName}</strong> (ID: {spaceId})
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Product ID: <code>{product._id || "Missing"}</code>
          </Typography>

          <TextField
            fullWidth
            label="Product Name *"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading || !product._id}
            error={!formData.name?.trim()}
            helperText={
              !formData.name?.trim() ? "Product name is required" : ""
            }
          />

          <TextField
            fullWidth
            label="Description"
            name="desc"
            value={formData.desc || ""}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            disabled={loading || !product._id}
          />

          <TextField
            fullWidth
            label="Box/Location"
            name="box"
            value={formData.box || ""}
            onChange={handleChange}
            margin="normal"
            disabled={loading || !product._id}
            helperText="Specific location within the space"
          />

          {/* Collaborators Section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Collaborators
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <TextField
                size="small"
                label="Add collaborator"
                value={collaboratorInput}
                onChange={(e) => setCollaboratorInput(e.target.value)}
                onKeyPress={handleCollaboratorKeyPress}
                sx={{ flexGrow: 1 }}
                disabled={loading || !product._id}
              />
              <Button
                variant="outlined"
                onClick={handleCollaboratorAdd}
                disabled={!collaboratorInput.trim() || loading || !product._id}
              >
                Add
              </Button>
            </Stack>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {formData.collaborators?.map((collaborator, index) => (
                <Chip
                  key={index}
                  label={collaborator}
                  onDelete={() => handleCollaboratorDelete(collaborator)}
                  size="small"
                  variant="outlined"
                  disabled={loading || !product._id}
                />
              ))}
            </Box>
          </Box>

          {/* Image Upload Section */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
            <Avatar
              src={preview || formData.image}
              alt={formData.name || "preview"}
              sx={{ width: 56, height: 56 }}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || !product._id}
            >
              Change Image
            </Button>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={loading || !product._id}
            />
          </Stack>

          <TextField
            fullWidth
            label="Or paste Image URL"
            name="image"
            value={formData.image || ""}
            onChange={handleChange}
            margin="normal"
            disabled={loading || !product._id}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="edit-product-form"
          variant="contained"
          disabled={!formData.name?.trim() || loading || !product._id}
        >
          {loading ? "Updating..." : "Update Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
