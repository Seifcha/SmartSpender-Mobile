import { Fournisseur } from "../entities/Fournisseur";

export interface IFournisseurInteractor {
  ajouterFournisseur(input: any);
  modifierFournisseur(
    id: number,
    nom: string,
    logo: string,
    mail: string,
    phone: number,
    isPublic: number,
    idCategorieFournisseur: number
  );
  supprimerFournisseur(IdFournisseur: number);
  getFournisseurs(userEmail: string, categorieDepense: number | string);
  getFournisseursss(userEmail: string, categorieRevenu: number | string);

  getFournisseur(IdFournisseur: number);
  getFournisseurss(userEmail: string);
}
