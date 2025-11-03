import { type IItem, type IRoom } from "../types";
import { normalize } from "./normalize";

export const groupProductsBySpace = (
  products: IItem[]
): Record<string, IItem[]> => {
  return products.reduce<Record<string, IItem[]>>((acc, product) => {
    const spaceId = normalize(product.box);
    if (!acc[spaceId]) acc[spaceId] = [];
    acc[spaceId].push(product);
    return acc;
  }, {});
};

export const filterSpacesWithProducts = (
  spaces: IRoom[],
  productsBySpace: Record<string, IItem[]>
): IRoom[] => {
  return spaces.filter(
    (space) => productsBySpace[normalize(space.id)]?.length > 0
  );
};
