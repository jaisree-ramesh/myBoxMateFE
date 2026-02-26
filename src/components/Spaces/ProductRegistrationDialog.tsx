import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ProductRegistrationForm from "./ProductRegistrationForm";
import { type IItem } from "../../types";
import { API_BASE, authHeaders } from "../../config/api";

interface ProductRegistrationDialogProps {
  open: boolean;
  spaceId: string;
  spaceName: string;
  defaultBox?: string;
  onClose: () => void;
  onSave: (data: IItem) => void;
}

export default function ProductRegistrationDialog({
  open,
  spaceId,
  spaceName,
  defaultBox,
  onClose,
  onSave,
}: ProductRegistrationDialogProps) {
  const handleSubmit = async (productData: Partial<IItem>) => {
    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          name: productData.name,
          desc: productData.desc,
          // box = the box ObjectId (or spaceId if no box selected)
          box: productData.box ?? defaultBox ?? spaceId,
          // parentId = the space ObjectId
          parentId: spaceId,
          image: productData.image,
          collaborators: productData.collaborators,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", res.status, errorText);
        throw new Error(`Failed to save product: ${res.status}`);
      }

      // MongoDB returns the full document with _id
      const saved = await res.json();
      const savedProduct: IItem = {
        ...saved,
        _id: saved._id?.toString(),
        id: saved._id?.toString(),
      };

      onSave(savedProduct);
      onClose();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Register New Product in {spaceName}</DialogTitle>
      <DialogContent>
        <ProductRegistrationForm
          spaceId={spaceId}
          spaceName={spaceName}
          defaultBox={defaultBox}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
