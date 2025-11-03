export interface IUser {
  _id: string;
  username: string;
  email: string;
  token?: string; // JWT token returned on login/register
}

/* export interface IItem {
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
} */

export interface IItem {
  _id?: string;
  name: string;
  desc?: string;
  box?: string;
  parentId?: string;
  owner?: string;
  collaborators?: string[];
  createdBy?: string;
  editedBy?: string;
  image?: string;
  qrCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ✅ For clickable images
export interface IImageData {
  id: string;
  image: string; // Required
  alt: string;
  link?: string;
}

export interface ISpace {
  id: string;
  image?: string; // Optional
  alt: string;
}

// ✅ For component prop typing
export interface ClickableImageItem {
  data: IImageData[];
}
export interface IRoom {
  id: string;
  dbId?: string; 
  image?: string;
  alt: string;
}

export interface ICategoryIcon {
  id: string;
  image: string;
  alt: string;
}

export interface DisplayedSpacesProps {
  refreshTrigger?: number;
}

export interface ProductRegistrationFormProps {
  spaceId: string;
  spaceName: string;
  onSubmit: (productData: Partial<IItem>) => void;
  onCancel: () => void;
}

export interface ProductRegistrationDialogProps {
  open: boolean;
  spaceId: string;
  spaceName: string;
  onClose: () => void;
  onSave: (data: Partial<IItem>) => void;
}

export interface ProductFormData {
  name: string;
  desc: string;
  box: string;
  parentId: string;
  image: string;
}

// For API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
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
  ariaLabel: string;
  button: ButtonItem[];
}

export interface ButtonProps {
  data: ButtonTypes[];
}

export interface Product {
  id: number;
  name: string;
  boxId: string;
  qrCode: string;
  registeredAt: string;
}

export interface ProductFormData {
  name: string;
  desc: string;
  box: string;
  parentId: string;
  image: string;
  imageFile?: File;
}
