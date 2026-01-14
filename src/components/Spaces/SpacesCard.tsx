import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import { IconButton } from "@mui/material";
import Add from "../../assets/icons/add.png";
import { type IRoom } from "../../types";
import EditIcon from "@mui/icons-material/Edit";

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
        width: "100%",
        borderRadius: "10px",
        p: 0,
        border: isSelected ? 2 : 1,
        cursor: "pointer",
        borderColor: "rgba(160, 82, 45, 0.15)",
        boxShadow: "0px 0px 10px -2px rgba(160, 82, 45, 0.34)",
        gap: 0,
        "@media (max-width: 635px)": {
          flexDirection: "column",
        },
      }}
    >
      {/* MAIN CONTENT */}
      <CardContent
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          p: "1rem",
          width: "100%",
          fontSize: "clamp(1rem, 0.643rem + 0.952vw, 1.5rem)",
          flexGrow: 1,
        }}
      >
        {/* IMAGE */}
        <CardOverflow className="space-image">
          <AspectRatio
            ratio="1"
            sx={{
              width: "18vw",
              borderRadius: 8,
              overflowWrap: "anywhere",

              "&:hover": {
                opacity: 0.8,
                transform: "scale(1.05)",
                transition: "transform 0.3s",
              },
              "@media (max-width: 1256px)": {
                width: "35vw",
              },
              "@media (max-width: 455px)": {
                width: "85vw",
              },
            }}
          >
            <img src={space.image || Add} loading="lazy" alt={space.alt} />
          </AspectRatio>
        </CardOverflow>

        {/* TITLE */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography
            textColor="#4F4F4F"
            sx={{
              fontWeight: "sm",
              textTransform: "capitalize",
              flexGrow: 1,
              overflowWrap: "anywhere",
              fontSize: "clamp(1rem, 0.643rem + 0.952vw, 1.5rem)",
            }}
          >
            {space.alt}
          </Typography>

          {/* EDIT BUTTON */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onImageEdit(space);
            }}
            sx={{
              color: "#4F4F4F",
              alignSelf: "flex-start",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <EditIcon />
          </IconButton>
        </Box>
      </CardContent>

      {/* SIDE / BOTTOM OVERFLOW */}
      {space.id !== "Create new room" && (
        <CardOverflow
          variant="soft"
          color="neutral"
          sx={{
            px: 0.5,
            py: 1,
            writingMode: "vertical-rl",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "xs",
            fontWeight: "xl",
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderLeft: "1px solid",
            borderColor: "divider",

            "@media (max-width: 635px)": {
              writingMode: "horizontal-tb",
              borderLeft: "none",
              borderTop: "1px solid",
              borderRadius: "0 0 8px 8px",
              py: 1,
            },
          }}
        >
          {productCount} {productCount > 1 ? "products" : "product"}
        </CardOverflow>
      )}
    </Card>
  );
};
