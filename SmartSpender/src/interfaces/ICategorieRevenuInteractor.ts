import { CategorieRevenu } from "../entities/CategorieRevenu";
// import { SousCategorieRevenu } from "../entities/SousCategorieRevenu";
import Buffer from "buffer";
export interface ICategorieRevenuInteractor {
  ajouterCategorieRevenu(input: any);
  modifierCategorieRevenu(
    id: number,
    nomCategorie: string,
    image: string,
    possedeFournisseurRevenu: number,
    idCategoriesFournisseurSelected: number[],
    isPublicInt: number
  );
  supprimerCategorieRevenu(id: number): Promise<void>;
  getCategorieRevenus(userEmail: string);
  getCategorieRevenu(id: number);
  ajouterCategoriesRevenuFournisseur(
    categoryId: number,
    categoriesFournisseur: number[]
  );
}
