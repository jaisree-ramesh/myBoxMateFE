import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ProductRegistrationForm from "./ProductRegistrationForm";
import { type IItem } from "../../types";

interface ProductRegistrationDialogProps {
  open: boolean;
  spaceId: string;
  spaceName: string;
  onClose: () => void;
  onSave: (data: Partial<IItem>) => void;
}

export default function ProductRegistrationDialog({
  open,
  spaceId,
  spaceName,
  onClose,
  onSave,
}: ProductRegistrationDialogProps) {
  const handleSubmit = async (productData: Partial<IItem>) => {
    try {
      const res = await fetch("http://localhost:3000/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error("Failed to save product");

      const savedProduct = await res.json();
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
