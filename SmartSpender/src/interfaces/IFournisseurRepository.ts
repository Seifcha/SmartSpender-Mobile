import { CategorieDepense } from "./../entities/CategorieDepense";
import { Fournisseur } from "../entities/Fournisseur";

export interface IFournisseurRepository {
  create(categorie: Fournisseur): Promise<Fournisseur>;
  update(
    id: number,
    nom: string,
    logo: string,
    mail: string,
    phone: number,
    isPublicInt,
    idCategorieFournisseur: number
  ): Promise<Fournisseur>;
  delete(IdFournisseur: number): Promise<boolean>;
  findAll(
    userEmail: string,
    categorieDepense: number | string
  ): Promise<Fournisseur[]>;
  findAl(
    userEmail: string,
    categorieRevenu: number | string
  ): Promise<Fournisseur[]>;

  findAlll(userEmail: string): Promise<Fournisseur[]>;
  findById(IdFournisseur: number): Promise<Fournisseur | null>;
}
