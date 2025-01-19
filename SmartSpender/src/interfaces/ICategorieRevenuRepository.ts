import { CategorieRevenu } from "../entities/CategorieRevenu";
import Buffer from "buffer";
export interface ICategorieRevenuRepository {
  create(categorie: CategorieRevenu): Promise<CategorieRevenu>;
  modifierCategorieRevenu(
    id: number,
    nomCategorie: string,
    image: string,
    possedeFournisseurRevenu: number,
    isPublicInt: number
  );
  ajouterNouvellesLignesCategoriesRevenuFournisseur(
    idCategorieRevenu: number,
    idCategoriesFournisseurSelected: number[]
  );

  supprimerToutesAssociations(idCategorieRevenu: number);
  supprimerAssociationsNonIncluses(
    idCategorieRevenu: number,
    idCategoriesFournisseurSelected: number[]
  );
  supprimerCategorieRevenu(id: number): Promise<void>;
  findAll(userEmail: string): Promise<CategorieRevenu[]>;
  findAllByVisibility(
    isValid: boolean,
    userEmail?: string
  ): Promise<CategorieRevenu[]>;
  findById(id: number): Promise<CategorieRevenu | null>;
  createCategoriesRevenuFournisseur(
    categoryId: number,
    categoriesFournisseur: number[]
  );
}
