import { Transaction } from "./../entities/Transaction";
import { Revenu } from "../entities/Revenu";

export interface IRevenuRepository {
  ajouterRevenu(revenu: Revenu): Promise<Revenu>;
  ajouterTransactions(
    transactions: any[],
    idRevenu: number,
    userEmail: string
  ): Promise<Transaction[]>;

  findAll(userEmail: string): Promise<Revenu[]>;
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<{
    createdAt: string;
    dateRevenu: string;
    recurrente: boolean;
    recurrenceOption: string;
    description: string;
    nomFournisseur: string;
    nomCategorie: string;
  } | null>;
}
