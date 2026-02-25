import React from "react";
import { Grid } from "@mui/material";
import { type IRoom, type IBox } from "../../types";
import { SpacesCard } from "./SpacesCard";

interface SpacesGridProps {
  spaces: IRoom[];
  selectedSpaceId: string | null;
  onSpaceClick: (spaceId: string) => void;
  onImageEdit: (space: IRoom) => void;
  onDelete: (space: IRoom) => void;
  boxesBySpace: Record<string, IBox[]>;
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
    <Grid
      container
      spacing="0.3rem"
      className="spaces-grid"
      sx={{
        pb: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexBasis: "auto",
        margin: "1rem 0",
        flexWrap: "wrap",
      }}
    >
      {spaces.map((space) => (
        <Grid key={space.id}>
          <SpacesCard
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
        </Grid>
      ))}
    </Grid>
  );
};
