import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Stack,
  Chip,
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
  const [formData, setFormData] = useState<Partial<IItem>>({
    name: "",
    desc: "",
    box: spaceId,
    parentId: "",
    image: "",
    collaborators: [],
  });

  const [collaboratorInput, setCollaboratorInput] = useState("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    // DO NOT include _id here - let the backend generate it
    const productData: Partial<IItem> = {
      ...formData,
      name: formData.name.trim(),
      box: spaceId,
      parentId: formData.parentId || spaceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Remove empty strings and empty arrays
      desc: formData.desc?.trim() || undefined,
      image: formData.image?.trim() || undefined,
      collaborators: formData.collaborators?.length
        ? formData.collaborators
        : undefined,
    };

    console.log("🔄 Submitting product data:", productData);
    console.log("📦 Space ID being used:", spaceId);
    console.log("🚫 No ID included - backend should generate it");
    onSubmit(productData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Space: <strong>{spaceName}</strong> (ID: {spaceId})
      </Typography>

      <TextField
        fullWidth
        label="Product Name *"
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
        placeholder="Enter product description..."
      />

      <TextField
        fullWidth
        label="Box/Location"
        name="box"
        value={formData.box}
        onChange={handleChange}
        margin="normal"
        placeholder="e.g., Shelf A, Drawer 3"
        helperText="Specific location within the space"
      />

      <TextField
        fullWidth
        label="Parent ID"
        name="parentId"
        value={formData.parentId}
        onChange={handleChange}
        margin="normal"
        placeholder="Leave empty to use space as parent"
        helperText="For nested items hierarchy"
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
          />
          <Button
            variant="outlined"
            onClick={handleCollaboratorAdd}
            disabled={!collaboratorInput.trim()}
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
          disabled={!formData.name?.trim()}
        >
          Register Product
        </Button>
      </Box>
    </Box>
  );
}
