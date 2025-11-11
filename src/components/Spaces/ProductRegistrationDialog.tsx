import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ProductRegistrationForm from "./ProductRegistrationForm";
import { type IItem } from "../../types";

// Define the backend response type
interface BackendProductResponse {
  id: string;
  name: string;
  desc?: string;
  box?: string;
  parentId?: string;
  image?: string;
  collaborators?: string[];
  qrCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductRegistrationDialogProps {
  open: boolean;
  spaceId: string;
  spaceName: string;
  onClose: () => void;
  onSave: (data: IItem) => void;
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
      console.log("🚀 Creating product with data:", productData);

      const res = await fetch("http://localhost:3000/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      console.log("📡 Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ API Error:", res.status, errorText);
        throw new Error(`Failed to save product: ${res.status}`);
      }

      const backendProduct: BackendProductResponse = await res.json();
      console.log("✅ Raw product from backend:", backendProduct);

      // Transform the backend response to frontend format
      const savedProduct: IItem = {
        ...backendProduct,
        _id: backendProduct.id, // Transform id to _id
      };

      console.log("🔄 Transformed product:", savedProduct);
      console.log("🆔 Product _id:", savedProduct._id);

      if (!savedProduct._id) {
        console.error("❌ CRITICAL: No ID found in product!", backendProduct);
        alert(
          "Warning: Product was created but no ID was returned. Edit/Delete may not work."
        );
      }

      onSave(savedProduct);
      onClose();
    } catch (err) {
      console.error("❌ Error saving product:", err);
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
