import { type IItem, type IRoom } from "../types";
import { normalize } from "./normalize";

/**
 * Groups products by their SPACE (parentId).
 * Used for space cards and passing products into SpaceProductsModal.
 */
export const groupProductsBySpace = (
  products: IItem[]
): Record<string, IItem[]> => {
  return products.reduce<Record<string, IItem[]>>((acc, product) => {
    const spaceId = normalize(product.parentId ?? "");
    if (!spaceId) return acc;
    if (!acc[spaceId]) acc[spaceId] = [];
    acc[spaceId].push(product);
    return acc;
  }, {});
};

/**
 * Filters spaces that have at least one product assigned to them.
 */
export const filterSpacesWithProducts = (
  spaces: IRoom[],
  productsBySpace: Record<string, IItem[]>
): IRoom[] => {
  return spaces.filter(
    (space) =>
      productsBySpace[normalize(space.id)]?.length > 0 ||
      productsBySpace[normalize(space.dbId ?? "")]?.length > 0
  );
};