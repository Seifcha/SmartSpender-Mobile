import { SousCategorieDepense } from "../entities/SousCategorieDepense";

export interface ISousCategorieDepenseRepository {
  create(categorie: SousCategorieDepense): Promise<SousCategorieDepense>;
  update(
    id: number,
    nomCategorie: string,
    image: string,
    isPublic: boolean
  ): Promise<SousCategorieDepense>;
  delete(id: number): Promise<boolean>;
  findAll(
    userEmail: string,
    idCategorieParente: number
  ): Promise<SousCategorieDepense[]>;
  findById(id: number): Promise<SousCategorieDepense | null>;
}
