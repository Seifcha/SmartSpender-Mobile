import { Compte } from "../entities/Compte";

export interface ICompteInteractor {
  ajouterCompte(input: any);
  modifierCompte(
    solde: number,
    status: string,
    creditLign: number,
    nomCompte: string,
    id: number
  );
  supprimerCompte(id: number): Promise<boolean>;
  getComptes(userEmail: string): Promise<Compte[]>;
  getComptesBancaires(userEmail: string, typeCarte: string): Promise<Compte[]>;
  getCompte(id: number): Promise<Compte | null>;
  getCompteByType(typeCompte: string, userEmail: string): Promise<Compte[]>;
}
