import { CategorieDepense } from "../entities/CategorieDepense";
import Buffer from "buffer";
export interface ICategorieDepenseRepository {
  create(categorie: CategorieDepense): Promise<CategorieDepense>;
  modifierCategorieDepense(
    id: number,
    nomCategorie: string,
    image: string,
    possedeFournisseurDepense: number,
    isPublicInt: number
  );
  ajouterNouvellesLignesCategoriesDepenseFournisseur(
    idCategorieDepense: number,
    idCategoriesFournisseurSelected: number[]
  );

  supprimerToutesAssociations(idCategorieDepense: number);
  supprimerAssociationsNonIncluses(
    idCategorieDepense: number,
    idCategoriesFournisseurSelected: number[]
  );
  supprimerCategorieDepense(id: number): Promise<void>;
  findAll(userEmail: string): Promise<CategorieDepense[]>;
  findAllByVisibility(
    isValid: boolean,
    userEmail?: string
  ): Promise<CategorieDepense[]>;
  findById(id: number): Promise<CategorieDepense | null>;
  createCategoriesDepenseFournisseur(
    categoryId: number,
    categoriesFournisseur: number[]
  );
}
