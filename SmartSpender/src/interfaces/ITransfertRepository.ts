import { Transaction } from "./../entities/Transaction";
import { Transfert } from "../entities/Transfert";

export interface ITransfertRepository {
  ajouterTransfert({
    description,
    dateTransfert,
    DeCompte,
    VersCompte,
    montant,
    userEmail,
  }: Transfert): Promise<Transfert>;
  checkMontant(
    montant: number,
    DeCompte: number,
    userEmail: string
  ): Promise<boolean>;
  findById(id: number): Promise<Transfert | null>;
  findAll(userEmail: string): Promise<Transfert[]>;
  delete(id: number): Promise<boolean>;
}
