import { CategorieFournisseur } from "../entities/CategorieFournisseur";

export interface ICategorieFournisseurInteractor {
  getCategorieFournisseurs(limit: number | undefined, offset: number);
  getCategorieFournisseur(IdCategorieFournisseur: number);
}
