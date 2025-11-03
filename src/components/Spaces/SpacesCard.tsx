// components/Spaces/SpaceCard.tsx
import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { type IRoom } from "../../types";
import Add from "../../assets/icons/add.png";

interface SpaceCardProps {
  space: IRoom;
  isSelected: boolean;
  productCount: number;
  onCardClick: (spaceId: string) => void;
  onImageEdit: (space: IRoom) => void;
}

export const SpacesCard: React.FC<SpaceCardProps> = ({
  space,
  isSelected,
  productCount,
  onCardClick,
  onImageEdit,
}) => {
  return (
    <Card
      sx={{
        cursor: "pointer",
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? "primary.main" : "grey.300",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "relative",
          "&:hover .image-overlay": { opacity: 1 },
        }}
      >
        <div className="image-props">
          <div className="image-wrapper">
            <CardMedia
              component="img"
              height="auto"
              image={space.image || Add}
              alt={space.alt}
              onClick={() => onCardClick(space.id)}
            />
            <span>{space.alt}</span>
          </div>
        </div>
        <Box
          className="image-overlay"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            opacity: 0,
            transition: "opacity 0.3s",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "0 0 0 8px",
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onImageEdit(space);
            }}
            sx={{
              color: "white",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <EditIcon />
          </IconButton>
        </Box>
      </Box>
      <CardContent>
        <Typography variant="h6">{space.alt}</Typography>
        {space.id !== "Create new room" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {productCount} products
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {space.id}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
