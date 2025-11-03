import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import { type IItem } from "../../types";

interface ProductRegistrationFormProps {
  spaceId: string;
  spaceName: string;
  onSubmit: (productData: Partial<IItem>) => void;
  onCancel: () => void;
}

export default function ProductRegistrationForm({
  spaceId,
  spaceName,
  onSubmit,
  onCancel,
}: ProductRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    box: spaceId,
    parentId: "",
    image: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Ensure the box field uses the normalized spaceId
    const productData = {
      ...formData,
      name: formData.name.trim(),
      box: spaceId, // Use the normalized spaceId from props
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Submitting product:", productData);
    console.log("🔄 Submitting product data:", productData);
    console.log("📦 Space ID being used:", spaceId);
    onSubmit(productData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Space: <strong>{spaceName}</strong> (ID: {spaceId})
      </Typography>

      <TextField
        fullWidth
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Description"
        name="desc"
        value={formData.desc}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={3}
      />

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
        <Avatar
          src={preview || formData.image}
          alt={formData.name || "preview"}
          sx={{ width: 56, height: 56 }}
        />
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Image
        </Button>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Stack>

      <TextField
        fullWidth
        label="Or paste Image URL"
        name="image"
        value={formData.image}
        onChange={handleChange}
        margin="normal"
        placeholder="https://example.com/image.jpg"
      />

      <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!formData.name.trim()}
        >
          Register Product
        </Button>
      </Box>
    </Box>
  );
}
