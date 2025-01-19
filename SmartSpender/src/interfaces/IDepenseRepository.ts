import { Notification } from "./../entities/Notification";
import { Transaction } from "./../entities/Transaction";
import { Depense } from "../entities/Depense";

export interface IDepenseRepository {
  checkMontant(transactions: any[], userEmail: string): Promise<boolean>;
  ajouterDepense({
    recurrente,
    recurrenceOption,
    description,
    dateDepense,
    categorieDepense,
    sousCategorie,
    fournisseur,
    montant,
    userEmail,
    transactions, // Ajoutez les transactions ici
  }: {
    recurrente: boolean;
    recurrenceOption: string;
    description: string;
    dateDepense: string;
    categorieDepense: number;
    sousCategorie: number;
    fournisseur: number;
    montant: number;
    userEmail: string;
    transactions: any[]; // Type des transactions
  }): Promise<Depense>;
  ajouterTransactions(
    transactions: any[],
    idDepense: number,
    userEmail: string
  ): Promise<Transaction[]>;
  ajouterSeuilCategorie(
    categorieDepense: number,
    userEmail: string,
    montant: number
  ): Promise<void>;
  ajouterSeuilSousCategorie(
    sousCategorie: number,
    userEmail: string,
    montant: number
  ): Promise<void>;

  findById(id: number): Promise<{
    createdAt: string;
    dateDepense: string;
    recurrente: boolean;
    recurrenceOption: string;
    description: string;
    nomFournisseur: string;
    nomSousCategorie: string;
    nomCategorie: string;
  } | null>;
  findAll(userEmail: string): Promise<Depense[]>;
  delete(id: number): Promise<boolean>;
  ajouterNotificationsPeriodiques(
    idDepense: number,
    userEmail: string
  ): Promise<Notification>;
}
