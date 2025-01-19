import { Seuil } from "../entities/Seuil";

export interface ISeuilInteractor {
  ajouterSeuil(input: any);
  modifierSeuil(id: number, montant: number, periode: string);
  supprimerSeuil(id: number): Promise<boolean>;
  getSeuils(userEmail: string): Promise<Seuil[]>;
  getSeuil(id: number): Promise<Seuil | null>;
  getSeuilByCategorieDepense(
    categorieDepense: number,
    userEmail: string
  ): Promise<number[]>;
  getSeuilBySousCategorieDepense(
    sousCategorie: number,
    userEmail: string
  ): Promise<number[]>;
}
