import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { type IBox } from "../../types";
import { API_BASE, authHeaders } from "../../config/api";

const ICON_OPTIONS = [
  "📦",
  "🧣",
  "👟",
  "👗",
  "🧥",
  "👔",
  "🎒",
  "🧳",
  "🔧",
  "🔨",
  "⚙️",
  "🪛",
  "🔌",
  "💡",
  "🧹",
  "🪣",
  "📚",
  "🎮",
  "🎨",
  "🎵",
  "🏋️",
  "⚽",
  "🧸",
  "🪆",
  "💊",
  "🧴",
  "🪥",
  "🧼",
  "🍳",
  "🥘",
  "☕",
  "🍷",
];

const COLOR_OPTIONS = [
  "#D97706",
  "#DC2626",
  "#7C3AED",
  "#2563EB",
  "#059669",
  "#DB2777",
  "#0891B2",
  "#65A30D",
  "#EA580C",
  "#4F46E5",
  "#9333EA",
  "#0F766E",
];

interface CreateBoxDialogProps {
  open: boolean;
  spaceId: string;
  spaceName: string;
  onClose: () => void;
  onSave: (box: IBox) => void;
}

export default function CreateBoxDialog({
  open,
  spaceId,
  spaceName,
  onClose,
  onSave,
}: CreateBoxDialogProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("📦");
  const [selectedColor, setSelectedColor] = useState("#D97706");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setName("");
    setDesc("");
    setSelectedIcon("📦");
    setSelectedColor("#D97706");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Box name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/boxes`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          name: name.trim(),
          desc: desc.trim() || undefined,
          icon: selectedIcon,
          color: selectedColor,
          parentId: spaceId,
        }),
      });

      if (!res.ok) throw new Error(`Failed to create box: ${res.status}`);

      const created = await res.json();
      // MongoDB route returns { id, name, desc, icon, color, parentId, ... }
      const box: IBox = { ...created, _id: created.id };

      onSave(box);
      handleClose();
    } catch (err) {
      console.error("Error creating box:", err);
      setError("Failed to create box. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #3E2310 0%, #5C3A1E 100%)",
          color: "#F5F5DC",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 2,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: selectedColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          {selectedIcon}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={700} color="#F5F5DC">
            New Box
          </Typography>
          <Typography variant="caption" color="#A07850">
            in {spaceName}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <TextField
          fullWidth
          label="Box Name *"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          error={!!error}
          helperText={error || "e.g. Scarfs, Winter Clothes, Tools…"}
          margin="normal"
          autoFocus
        />

        <TextField
          fullWidth
          label="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          margin="normal"
          multiline
          rows={2}
          placeholder="What's stored in this box?"
        />

        {/* Icon picker */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Icon
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              p: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              background: "#FAFAFA",
            }}
          >
            {ICON_OPTIONS.map((emoji) => (
              <Tooltip key={emoji} title={emoji} arrow>
                <Box
                  onClick={() => setSelectedIcon(emoji)}
                  sx={{
                    width: 38,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    borderRadius: 1.5,
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor:
                      selectedIcon === emoji ? selectedColor : "transparent",
                    background:
                      selectedIcon === emoji
                        ? `${selectedColor}22`
                        : "transparent",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      background: `${selectedColor}18`,
                      transform: "scale(1.15)",
                    },
                  }}
                >
                  {emoji}
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Color picker */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Color
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {COLOR_OPTIONS.map((color) => (
              <Tooltip key={color} title={color} arrow>
                <Box
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: color,
                    cursor: "pointer",
                    border: "3px solid",
                    borderColor:
                      selectedColor === color ? "#391D07" : "transparent",
                    outline:
                      selectedColor === color
                        ? `2px solid ${color}`
                        : "2px solid transparent",
                    outlineOffset: 2,
                    transition: "all 0.15s ease",
                    "&:hover": { transform: "scale(1.2)" },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Live preview */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            background: "linear-gradient(135deg, #5C3A1E 0%, #3E2310 100%)",
            border: `2px solid ${selectedColor}`,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: selectedColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
            }}
          >
            {selectedIcon}
          </Box>
          <Box>
            <Typography fontWeight={700} color="#F5F5DC">
              {name || "Box Name"}
            </Typography>
            {desc && (
              <Typography variant="caption" color="#A07850">
                {desc}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim() || loading}
          sx={{
            background: selectedColor,
            "&:hover": { filter: "brightness(0.9)" },
          }}
        >
          {loading ? "Creating…" : "Create Box"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
