import React from "react";
import { Grid } from "@mui/material";
import { type IRoom, type IItem } from "../../types";
import { SpacesCard } from "./SpacesCard";

interface SpacesGridProps {
  spaces: IRoom[];
  selectedSpaceId: string | null;
  onSpaceClick: (spaceId: string) => void;
  onImageEdit: (space: IRoom) => void;
  productsBySpace: Record<string, IItem[]>;
}

export const SpacesGrid: React.FC<SpacesGridProps> = ({
  spaces,
  selectedSpaceId,
  onSpaceClick,
  onImageEdit,
  productsBySpace,
}) => {
  return (
    <Grid
      container
      spacing={2}
      className="spaces-grid"
      sx={{
        pb: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        "@media (max-width: 768px)": {
          flexDirection: "column",
        },
      }}
    >
      {spaces.map((space) => (
        <Grid key={space.id}>
          <SpacesCard
            space={space}
            isSelected={space.id === selectedSpaceId}
            productCount={productsBySpace[space.id]?.length || 0}
            onCardClick={onSpaceClick}
            onImageEdit={onImageEdit}
          />
        </Grid>
      ))}
    </Grid>
  );
};
