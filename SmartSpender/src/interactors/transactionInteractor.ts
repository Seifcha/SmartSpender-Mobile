import { inject, injectable } from "inversify";
import { ITransactionInteractor } from "../interfaces/ITransactionInteractor";
import { ITransactionRepository } from "../interfaces/ITransactionRepository";
import { INTERFACE_TYPE } from "../utils";
import { schedule } from "node-cron";
import { addMonths, addQuarters, addYears } from "date-fns";

@injectable()
export class TransactionInteractor implements ITransactionInteractor {
  private repository: ITransactionRepository;

  constructor(
    @inject(INTERFACE_TYPE.TransactionRepository)
    repository: ITransactionRepository
  ) {
    this.repository = repository;
  }

  async getTransactions(id: number) {
    return await this.repository.findAll(id);
  }
  async getTransactionsRevenu(id: number) {
    return await this.repository.findAllRevenu(id);
  }
  // async supprimerTransaction(id: number) {
  //   const success = await this.repository.delete(id);
  //   // faire des vérifications ou d'autres opérations
  //   return success;
  // }
}
