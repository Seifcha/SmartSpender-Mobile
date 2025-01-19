import { inject, injectable } from "inversify";
import { ITransfertInteractor } from "../interfaces/ITransfertInteractor";
import { ITransfertRepository } from "../interfaces/ITransfertRepository";
import { INTERFACE_TYPE } from "../utils";
import { schedule } from "node-cron";
import { addMonths, addQuarters, addYears } from "date-fns";

@injectable()
export class TransfertInteractor implements ITransfertInteractor {
  private repository: ITransfertRepository;
  private scheduledTasks: { [transfertId: number]: schedule.Job } = {};

  constructor(
    @inject(INTERFACE_TYPE.TransfertRepository)
    repository: ITransfertRepository
  ) {
    this.repository = repository;
  }

  // async deleteTransfert(transfertId: number) {
  //   // Logique pour supprimer la dépense de la base de données
  //   const success = await this.repository.delete(transfertId);
  //   // Faire des vérifications ou d'autres opérations
  //   return success;
  // }
  async getTransfert(id: number) {
    return await this.repository.findById(id);
  }
  async getTransferts(userEmail: string) {
    return await this.repository.findAll(userEmail);
  }
  async supprimerTransfert(id: number) {
    const success = await this.repository.delete(id);
    // faire des vérifications ou d'autres opérations
    return success;
  }

  async checkMontant(montant: number, DeCompte: number, userEmail: string) {
    const data = await this.repository.checkMontant(
      montant,
      DeCompte,
      userEmail
    );
    // faire des vérifications
    return data;
  }
  async ajouterTransfert(input: any) {
    const data = await this.repository.ajouterTransfert(input);
    // faire des vérifications
    return data;
  }
}
