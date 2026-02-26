import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import Add from "../../assets/icons/add.png";
import { type IRoom } from "../../types";

interface SpaceCardProps {
  space: IRoom;
  isSelected: boolean;
  boxCount: number;
  onCardClick: (spaceId: string) => void;
  onImageEdit: (space: IRoom) => void;
  onDelete: (space: IRoom) => void;
}

export const SpacesCard: React.FC<SpaceCardProps> = ({
  space,
  isSelected,
  boxCount,
  onCardClick,
  onImageEdit,
  onDelete,
}) => {
  return (
    <Box
      onClick={() => onCardClick(space.id)}
      sx={{
        position: "relative",
        cursor: "pointer",
        borderRadius: "14px",
        overflow: "hidden",
        background: isSelected
          ? "linear-gradient(135deg, #6B3A1F 0%, #4A2510 100%)"
          : "linear-gradient(135deg, #5C3A1E 0%, #3E2310 100%)",
        border: `2px solid ${isSelected ? "#FFA500" : "#7A4E2D"}`,
        boxShadow: isSelected
          ? "0 0 0 2px rgba(255,165,0,0.3), 0 8px 32px rgba(0,0,0,0.5)"
          : "0 4px 16px rgba(0,0,0,0.35)",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        minHeight: "100px",
        transition: "all 0.22s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
          borderColor: "#FFA500",
        },
      }}
    >
      {/* LEFT — image panel */}
      <Box
        sx={{
          width: { xs: "80px", sm: "100px" },
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          background: "#2C1A0E",
        }}
      >
        <Box
          component="img"
          src={space.image || Add}
          alt={space.alt}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: space.image ? 0.88 : 0.35,
            filter: space.image ? "none" : "grayscale(1)",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.07)" },
          }}
        />
        {/* inner shadow */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.35) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* MIDDLE — name + subtitle */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: 2,
          py: 1.5,
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            color: "#F5F5DC",
            textTransform: "capitalize",
            fontSize: "clamp(0.95rem, 0.7rem + 0.8vw, 1.3rem)",
            lineHeight: 1.2,
            wordBreak: "break-word",
            letterSpacing: "0.01em",
          }}
        >
          {space.alt}
        </Typography>

        {space.id !== "Create new room" && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Inventory2Icon sx={{ fontSize: 13, color: "#A07850" }} />
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "#A07850",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {boxCount} {boxCount === 1 ? "box" : "boxes"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* RIGHT — action buttons */}
      {space.id !== "Create new room" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.25,
            px: 1,
            borderLeft: "1px solid rgba(255,165,0,0.12)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="Edit image" placement="left">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onImageEdit(space);
              }}
              sx={{
                color: "#D4A964",
                "&:hover": {
                  bgcolor: "rgba(212,169,100,0.15)",
                  color: "#FFA500",
                },
                transition: "all 0.15s",
              }}
            >
              <EditIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete space" placement="left">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(space);
              }}
              sx={{
                color: "#8B3A3A",
                "&:hover": {
                  bgcolor: "rgba(192,57,43,0.15)",
                  color: "#e74c3c",
                },
                transition: "all 0.15s",
              }}
            >
              <DeleteIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Selected pip */}
      {isSelected && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#FFA500",
            boxShadow: "0 0 8px #FFA500",
          }}
        />
      )}
    </Box>
  );
};
