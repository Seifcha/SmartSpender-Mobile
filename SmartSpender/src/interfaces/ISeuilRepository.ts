import { Seuil } from "../entities/Seuil";

export interface ISeuilRepository {
  create(seuil: Seuil): Promise<Seuil>;
  update(id: number, montant: number, periode: string): Promise<Seuil>;
  delete(id: number): Promise<boolean>;
  findAll(userEmail: string): Promise<Seuil[]>;
  findById(id: number): Promise<Seuil | null>;
  getDifferencesForCategory(
    categorieDepense: number,
    userEmail: string
  ): Promise<number[]>;
  getDifferencesForSubCategory(
    sousCategorie: number,
    userEmail: string
  ): Promise<number[]>;
}
