import { SousCategorieDepense } from "../entities/SousCategorieDepense";

export interface ISousCategorieDepenseInteractor {
  //   getNomCategorieDepenseByID(idCategorieDepense: number): Promise<string>;
  ajouterSousCategorieDepense(input: any);
  modifierSousCategorieDepense(
    id: number,
    nomSousCategorie: string,
    image: string,
    isPublic: boolean
  );
  supprimerSousCategorieDepense(id: number): Promise<boolean>;
  // definirSeuil(id: number, seuil: number): Promise<SousCategorieDepense>;
  getSousCategoriesDepenses(
    userEmail: string,
    idCategorieParente: number
  ): Promise<SousCategorieDepense[]>;
  getSousCategorie(id: number);
}
