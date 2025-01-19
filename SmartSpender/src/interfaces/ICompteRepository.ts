import { Compte } from "../entities/Compte";

export interface ICompteRepository {
  create(compte: Compte): Promise<Compte>;
  update(
    solde: number,
    status: string,
    creditLign: number,
    nomCompte: string,
    id: number
  ): Promise<Compte>;
  delete(id: number): Promise<boolean>;
  findAll(userEmail: string): Promise<Compte[]>;
  findAllComptesBancaires(userEmail: string, typeCarte: string): Promise<Compte[]>;
  findById(id: number): Promise<Compte | null>;
  findAllByType(typeCompte: string, userEmail: string): Promise<Compte[]>;
}
