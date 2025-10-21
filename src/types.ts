export interface IUser {
  _id: string;
  username: string;
  email: string;
  token?: string; // JWT token returned on login/register
}

export interface IItem {
  _id: string;
  name: string;
  desc?: string;
  box?: string; // ObjectId of parent box
  parentId?: string; // undefined for boxes, box id for child items
  owner?: string; // user id of owner
  collaborators?: string[]; // array of user ids
  createdBy?: string;
  editedBy?: string;
  image?: string; // Cloudinary URL
  qrCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NavItem = {
  id?: number;
  name: string;
  link: string;
  ariaLabel?: string;
};

export type NavigationItemProps = {
  data: NavItem[];
};

export interface ImageItem {
  data: {
    link?: string;
    image: string;
    alt: string;
    id: number;
  }[];
}

export interface TextTypesProps {
  title: string;
  text: string;
}

export type TextProps = {
  data: TextTypesProps[];
};

export interface ButtonItem {
  text: string;
  link: string;
  id: number;
  
}

export interface ButtonTypes {
  id?: number;
  title?: string;
  text?: string;
  button: ButtonItem[];
  
}

export interface ButtonProps {
  data: ButtonTypes[];
}

