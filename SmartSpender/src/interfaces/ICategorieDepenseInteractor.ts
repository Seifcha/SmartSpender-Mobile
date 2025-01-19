import { CategorieDepense } from "../entities/CategorieDepense";
// import { SousCategorieDepense } from "../entities/SousCategorieDepense";
import Buffer from "buffer";
export interface ICategorieDepenseInteractor {
  ajouterCategorieDepense(input: any);
  modifierCategorieDepense(
    id: number,
    nomCategorie: string,
    image: string,
    possedeFournisseurDepense: number,
    idCategoriesFournisseurSelected: number[],
    isPublicInt: number
  );
  supprimerCategorieDepense(id: number): Promise<void>;
  getCategorieDepenses(userEmail: string);
  getCategorieDepense(id: number);
  ajouterCategoriesDepenseFournisseur(
    categoryId: number,
    categoriesFournisseur: number[]
  );
}
