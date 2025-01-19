import { User } from "./../entities/User";
import { inject, injectable } from "inversify";
import { IRevenuInteractor } from "../interfaces/IRevenuInteractor";
import { IRevenuRepository } from "../interfaces/IRevenuRepository";
import { INTERFACE_TYPE } from "../utils";
import { schedule } from "node-cron";
import { addMonths, addQuarters, addYears } from "date-fns";

@injectable()
export class RevenuInteractor implements IRevenuInteractor {
  private repository: IRevenuRepository;
  private scheduledTasks: { [revenuId: number]: schedule.Job } = {};

  constructor(
    @inject(INTERFACE_TYPE.RevenuRepository)
    repository: IRevenuRepository
  ) {
    this.repository = repository;
  }

  async deleteRevenu(revenuId: number) {
    if (this.scheduledTasks[revenuId]) {
      this.scheduledTasks[revenuId].stop(); // Arrêter la tâche cron associée
      delete this.scheduledTasks[revenuId]; // Supprimer la référence de la tâche
    }
    // Logique pour supprimer la dépense de la base de données
    const success = await this.repository.delete(revenuId);
    // Faire des vérifications ou d'autres opérations
    return success;
  }
  async ajouterRevenu(input: any) {
    const data = await this.repository.ajouterRevenu(input);
    // faire des vérifications
    return data;
  }
  async ajouterTransactions(
    transactions: any[],
    idRevenu: number,
    userEmail: string
  ) {
    const data = await this.repository.ajouterTransactions(
      transactions,
      idRevenu,
      userEmail
    );
    // faire des vérifications
    return data;
  }

  async scheduleRecurrentTask(
    idRevenu: number,
    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateRevenu: string,
    categorieRevenu: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  ) {
    switch (recurrenceOption) {
      case "mois":
        // const newDateRevenu = addMonths(
        //   Date.parse(dateRevenu),
        //   1
        // ).toISOString();

        this.scheduleMonthlyTask(
          idRevenu,
          recurrente,
          recurrenceOption,
          description,
          dateRevenu,
          categorieRevenu,
          fournisseur,
          montant,
          transactions,
          userEmail
        );
        break;
      case "3mois":
        this.scheduleQuarterlyTask(
          idRevenu,
          recurrente,
          recurrenceOption,
          description,
          dateRevenu,
          categorieRevenu,
          fournisseur,
          montant,
          transactions,
          userEmail
        );
        break;
      case "6mois":
        this.scheduleHalfYearlyTask(
          idRevenu,
          recurrente,
          recurrenceOption,
          description,
          dateRevenu,
          categorieRevenu,

          fournisseur,
          montant,
          transactions,
          userEmail
        );
        break;
      case "an":
        this.scheduleYearlyTask(
          idRevenu,
          recurrente,
          recurrenceOption,
          description,
          dateRevenu,
          categorieRevenu,
          fournisseur,
          montant,
          transactions,
          userEmail
        );
        break;
      default:
        console.error("Invalid recurrence option");
    }
  }

  private async scheduleMonthlyTask(
    idRevenu: number,
    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateRevenu: string,
    categorieRevenu: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  ) {
    // "0 0 1 */1 *"
    const task = schedule("* * * * *", async () => {
      try {
        console.log(dateRevenu);
        console.log(typeof dateRevenu);
        const newDateRevenu: Date = new Date(dateRevenu);
        const newDate: Date = addMonths(newDateRevenu, 1);
        dateRevenu = newDate.toISOString();

        console.log(newDate.toISOString());
        const revenu = await this.ajouterRevenu({
          recurrente,
          recurrenceOption,
          description,
          dateRevenu,
          categorieRevenu,
          fournisseur,
          montant,
          transactions,
          userEmail,
        });

        await this.ajouterTransactions(
          transactions,
          revenu.idRevenu,
          userEmail
        );
      } catch (error) {
        console.error("Error scheduling monthly task:", error);
      }
    });
    this.scheduledTasks[idRevenu] = task;

    console.log("Tâche mensuelle planifiée");
  }

  private async scheduleQuarterlyTask(
    idRevenu: number,

    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateRevenu: string,
    categorieRevenu: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  ) {
    schedule("0 0 1 */3 *", async () => {
      try {
        const revenu = await this.ajouterRevenu({
          recurrente,
          recurrenceOption,
          description,
          dateRevenu,
          categorieRevenu,
          fournisseur,
          montant,
          transactions,
          userEmail,
        });

        await this.ajouterTransactions(
          transactions,
          revenu.idRevenu,
          userEmail
        );
      } catch (error) {
        console.error("Error scheduling monthly task:", error);
      }
    });
    console.log("Tâche trimestrielle planifiée");
  }

  private async scheduleHalfYearlyTask(
    idRevenu: number,

    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateRevenu: string,
    categorieRevenu: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  ) {
    schedule("0 0 1 */6 *", async () => {
      try {
        const revenu = await this.ajouterRevenu({
          recurrente,
          recurrenceOption,
          description,
          dateRevenu,
          categorieRevenu,
          fournisseur,
          montant,
          transactions,
          userEmail,
        });

        await this.ajouterTransactions(
          transactions,
          revenu.idRevenu,
          userEmail
        );
      } catch (error) {
        console.error("Error scheduling monthly task:", error);
      }
    });
    console.log("Tâche semestrielle planifiée");
  }

  private async scheduleYearlyTask(
    idRevenu: number,
    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateRevenu: string,
    categorieRevenu: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  ) {
    schedule("0 0 1 1 *", async () => {
      try {
        const revenu = await this.ajouterRevenu({
          recurrente,
          recurrenceOption,
          description,
          dateRevenu,
          categorieRevenu,
          fournisseur,
          montant,
          transactions,
          userEmail,
        });

        await this.ajouterTransactions(
          transactions,
          revenu.idRevenu,
          userEmail
        );
      } catch (error) {
        console.error("Error scheduling monthly task:", error);
      }
    });
    console.log("Tâche annuelle planifiée");
  }

  async getRevenu(id: number) {
    return await this.repository.findById(id);
  }
  async getRevenus(userEmail: string) {
    return await this.repository.findAll(userEmail);
  }
}
