import { Carte } from "../entities/Carte";

export interface ICarteInteractor {
  ajouterCarte(input: any);
  modifierCarte(id: number, dateExpiration: string);
  supprimerCarte(id: number): Promise<boolean>;
  getCartes(userEmail: string): Promise<Carte[]>;
  getCarte(id: number): Promise<Carte | null>;
  getCartesByCompte(userEmail: string, idCompte: number): Promise<Carte[]>;
}
