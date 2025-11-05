import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import EditIcon from "@mui/icons-material/Edit";
import { type IRoom } from "../../types";
import Add from "../../assets/icons/add.png";
import { IconButton } from "@mui/material";
import Box from "@mui/joy/Box";

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
      orientation="horizontal"
      variant="outlined"
      onClick={() => onCardClick(space.id)}
      sx={{
        width: "40vw",
        borderRadius: "10px",
        p: 0,
        border: isSelected ? 2 : 1,
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
        borderColor: "rgba(160, 82, 45, 0.15)",
        boxShadow: "0px 0px 10px -2px rgba(160, 82, 45, 0.34)",
        "@media (max-width: 768px)": {
          width: "87vw",
        },
        "@media (max-width: 576px)": {
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "82vw",
          gap: 2,
          p: 0,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          gap: 2,
          p: "1rem",
        }}
      >
        <CardOverflow sx={{ width: "min-content" }}>
          <AspectRatio
            ratio="1"
            sx={{
              width: "15vw",
              borderRadius: 8,
              "&:hover": {
                opacity: 0.8,
                transform: "scale(1.05)",
                transition: "transform 0.3s",
              },
              "@media (max-width: 768px)": { minWidth: "35vw" },
              "@media (max-width: 576px)": {
                width: "100%",
                maxWidth: "50vw",
              },
            }}
          >
            <img
              src={space.image || Add}
              srcSet={space.image || Add}
              loading="lazy"
              alt={space.alt}
              onClick={() => onCardClick(space.id)}
              className="space-card-image"
            />
          </AspectRatio>
        </CardOverflow>
        <CardContent>
          <Typography
            textColor="#4F4F4F"
            sx={{
              fontWeight: "sm",
              fontSize: "xl",
              textTransform: "capitalize",
            }}
          >
            {space.alt}
          </Typography>
        </CardContent>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onImageEdit(space);
          }}
          sx={{
            color: "#4F4F4F",
            alignItems: "flex-start",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>
      {space.id !== "Create new room" && (
        <CardOverflow
          variant="soft"
          color="neutral"
          sx={{
            px: 0.2,
            writingMode: "vertical-rl",
            justifyContent: "center",
            fontSize: "xs",
            fontWeight: "xl",
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderLeft: "1px solid",
            borderColor: "divider",
            "@media (max-width: 576px)": {
              writingMode: "horizontal-tb",
              borderLeft: "none",
              borderTop: "1px solid",
              borderColor: "divider",
              textAlign: "center",
              borderRadius: "0 0 8px 8px",
              padding: "0.2rem",
            },
          }}
        >
          {productCount} {productCount > 1 ? `${"products"}` : `${"product"}`}
        </CardOverflow>
      )}
    </Card>
  );
};
