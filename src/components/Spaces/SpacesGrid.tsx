import React from "react";
import { Box } from "@mui/material";
import { type IRoom, type IBox } from "../../types";
import { SpacesCard } from "./SpacesCard";

interface SpacesGridProps {
  spaces: IRoom[];
  selectedSpaceId: string | null;
  onSpaceClick: (spaceId: string) => void;
  onImageEdit: (space: IRoom) => void;
  onDelete: (space: IRoom) => void;
  boxesBySpace?: Record<string, IBox[]>;
}

export const SpacesGrid: React.FC<SpacesGridProps> = ({
  spaces,
  selectedSpaceId,
  onSpaceClick,
  onImageEdit,
  onDelete,
  boxesBySpace = {},
}) => {
  return (
    <Box
      className="spaces-grid"
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "1fr 1fr 1fr",
        },
        gap: "0.75rem",
        pb: 4,
        my: "1rem",
      }}
    >
      {spaces.map((space) => (
        <SpacesCard
          key={space.id}
          space={space}
          isSelected={space.id === selectedSpaceId}
          boxCount={
            boxesBySpace[space.id]?.length ??
            boxesBySpace[space.dbId ?? ""]?.length ??
            0
          }
          onCardClick={onSpaceClick}
          onImageEdit={onImageEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};
