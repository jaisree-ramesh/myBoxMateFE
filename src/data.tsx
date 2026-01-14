import CloseMenu from "./assets/icons/material-symbols--close-rounded.svg";
import MyBoxImage from "./assets/images/my-box-mate-opened-menu.png";
import MyMateBoxLogo from "./assets/images/my-boy-mate-logo.png";
import MyBoxMateFront from "./assets/images/my-box-mate-header-image.jpg";
import AddIcon from "./assets/icons/material-symbols--add.svg";
import DeleteIcon from "./assets/icons/material-symbols--delete.svg";
import NotificationIcon from "./assets/icons/material-symbols--notification.svg";
import Closet from "./assets/icons/closet_.png";
import Fridge from "./assets/icons/fridge_.png";
import Garage from "./assets/icons/garage_.png";
import Garden from "./assets/icons/garden_.png";
import Kitchen from "./assets/icons/kitchen_.png";
import MovingTruck from "./assets/icons/moving-truck_.png";
import Package from "./assets/icons/package_.png";
import Warehouse from "./assets/icons/warehouse_.png";

export const closeMenu = [
  {
    id: 1,
    image: CloseMenu,
    alt: "My Box Mate - close menu",
  },
];

export const myBoxOpenedMenu = [
  {
    id: 1,
    image: MyBoxImage,
    alt: "My Box Mate - opened menu Logo",
  },
];

export const logoImage = [
  {
    id: 1,
    link: "/",
    image: MyMateBoxLogo,
    alt: "My Box Mate Logo",
  },
];

export const homeImage = [
  {
    id: 1,
    image: MyBoxMateFront,
    alt: "My Box Mate Front ",
  },
];

export const addIcon = [
  {
    id: 1,
    image: AddIcon,
    alt: "Add collaborator icon",
  },
];

export const deleteIcon = [
  {
    id: 1,
    image: DeleteIcon,
    alt: "Delete collaborator icon",
  },
];

export const notificationIcon = [
  {
    id: 1,
    image: NotificationIcon,
    alt: "Notification icon",
  },
];

export const categoryIcons = [
  { id: "Closet", image: Closet, alt: "Closet" },
  { id: "Fridge", image: Fridge, alt: "Fridge" },
  { id: "Garage", image: Garage, alt: "Garage" },
  { id: "Garden", image: Garden, alt: "Garden" },
  { id: "Kitchen", image: Kitchen, alt: "Kitchen" },
  { id: "Moving", image: MovingTruck, alt: "Moving" },
  { id: "Moving box", image: Package, alt: "Moving box" },
  { id: "Basement", image: Warehouse, alt: "Basement" },
];
