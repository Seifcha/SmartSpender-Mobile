import { inject, injectable } from "inversify";
import { IDepenseInteractor } from "../interfaces/IDepenseInteractor";
import { IDepenseRepository } from "../interfaces/IDepenseRepository";
import { INTERFACE_TYPE } from "../utils";
import { schedule, Job } from "node-cron";
import {
  addMonths,
  addQuarters,
  addYears,
  addMinutes,
  addHours,
} from "date-fns";

@injectable()
export class DepenseInteractor implements IDepenseInteractor {
  private repository: IDepenseRepository;
  private scheduledTasks: { [depenseId: number]: Job } = {};
  private notificationTasks: { [depenseId: number]: Job } = {};

  constructor(
    @inject(INTERFACE_TYPE.DepenseRepository)
    repository: IDepenseRepository
  ) {
    this.repository = repository;
  }

  async deleteDepense(depenseId: number) {
    if (this.scheduledTasks[depenseId]) {
      this.scheduledTasks[depenseId].stop();
      delete this.scheduledTasks[depenseId];
    }
    if (this.notificationTasks[depenseId]) {
      this.notificationTasks[depenseId].stop();
      delete this.notificationTasks[depenseId];
    }
    const success = await this.repository.delete(depenseId);
    return success;
  }

  async getDepense(id: number) {
    return await this.repository.findById(id);
  }

  async getDepenses(userEmail: string) {
    return await this.repository.findAll(userEmail);
  }

  async checkMontant(transactions: any[], userEmail: string) {
    const data = await this.repository.checkMontant(transactions, userEmail);
    return data;
  }

  async ajouterDepense(input: any) {
    const data = await this.repository.ajouterDepense(input);
    return data;
  }

  async ajouterTransactions(
    transactions: any[],
    idDepense: number,
    userEmail: string
  ) {
    const data = await this.repository.ajouterTransactions(
      transactions,
      idDepense,
      userEmail
    );
    return data;
  }

  async ajouterSeuilCategorie(
    categorieDepense: number,
    userEmail: string,
    montant: number
  ) {
    const data = await this.repository.ajouterSeuilCategorie(
      categorieDepense,
      userEmail,
      montant
    );
    return data;
  }

  async ajouterSeuilSousCategorie(
    sousCategorie: number,
    userEmail: string,
    montant: number
  ) {
    const data = await this.repository.ajouterSeuilSousCategorie(
      sousCategorie,
      userEmail,
      montant
    );
    return data;
  }

  async scheduleRecurrentTask(
    idDepense: number,
    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateDepense: string,
    categorieDepense: number,
    sousCategorie: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  ) {
    switch (recurrenceOption) {
      case "mois":
        this.scheduleMonthlyTask(
          idDepense,
          recurrente,
          recurrenceOption,
          description,
          dateDepense,
          categorieDepense,
          sousCategorie,
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
    idDepense: number,
    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateDepense: string,
    categorieDepense: number,
    sousCategorie: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  ) {
    console.log(dateDepense);
    let taskTime = new Date(dateDepense);

    console.log("taskTime", taskTime);
    let notificationTime = addMinutes(taskTime, 3);

    // Planification des tâches mensuelles pour une dépense récurrente
    const numOccurrences = 10; // Limiter le nombre d'occurrences pour éviter la boucle infinie
    for (let i = 0; i < numOccurrences; i++) {
      // Calcul de la notification

      // Calcul de la tâche principale
      const mainTaskTime = addMinutes(taskTime, 5);

      // Planification de la notification
      this.scheduleNotification(idDepense, userEmail, notificationTime);

      // Planification de la tâche principale
      this.scheduleMainTask(
        idDepense,
        recurrente,
        recurrenceOption,
        description,
        mainTaskTime,
        categorieDepense,
        sousCategorie,
        fournisseur,
        montant,
        transactions,
        userEmail
      );

      // Ajout d'un mois à la date de dépense pour la prochaine occurrence
      notificationTime = addMinutes(notificationTime, 5);
      taskTime = addMonths(taskTime, 1);
    }
  }

  private scheduleNotification(
    idDepense: number,
    userEmail: string,
    time: Date
  ) {
    const cronExpression = `${time.getMinutes()} ${time.getHours()} ${time.getDate()} ${
      time.getMonth() + 1
    } *`;
    const task = schedule(cronExpression, async () => {
      try {
        await this.repository.ajouterNotificationsPeriodiques(
          idDepense,
          userEmail
        );
      } catch (error) {
        console.error("Error scheduling notification task:", error);
      }
    });

    this.notificationTasks[idDepense] = task;
    console.log("Notification task scheduled at", time);
  }

  private scheduleMainTask(
    idDepense: number,
    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateDepense: Date,
    categorieDepense: number,
    sousCategorie: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  ) {
    const cronExpression = `${dateDepense.getMinutes()} ${dateDepense.getHours()} ${dateDepense.getDate()} ${
      dateDepense.getMonth() + 1
    } *`;
    const task = schedule(cronExpression, async () => {
      try {
        const depense = await this.ajouterDepense({
          recurrente,
          recurrenceOption,
          description,
          dateDepense: dateDepense.toISOString(),
          categorieDepense,
          sousCategorie,
          fournisseur,
          montant,
          transactions,
          userEmail,
        });

        if (categorieDepense) {
          await this.ajouterSeuilCategorie(
            categorieDepense,
            userEmail,
            montant
          );
        }
        if (sousCategorie) {
          await this.ajouterSeuilSousCategorie(
            sousCategorie,
            userEmail,
            montant
          );
        }

        await this.ajouterTransactions(
          transactions,
          depense.idDepense,
          userEmail
        );
      } catch (error) {
        console.error("Error scheduling main task:", error);
      }
    });

    this.scheduledTasks[idDepense] = task;
    console.log("Main task scheduled at", dateDepense);
  }

  private async scheduleQuarterlyTask(
    idDepense: number,
    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateDepense: string,
    categorieDepense: number,
    sousCategorie: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  ) {
    const task = schedule("0 0 1 */3 *", async () => {
      try {
        const newDateDepense: Date = new Date(dateDepense);
        const newDate: Date = addQuarters(newDateDepense, 1);
        dateDepense = newDate.toISOString();

        const depense = await this.ajouterDepense({
          recurrente,
          recurrenceOption,
          description,
          dateDepense,
          categorieDepense,
          sousCategorie,
          fournisseur,
          montant,
          transactions,
          userEmail,
        });
        if (categorieDepense) {
          await this.ajouterSeuilCategorie(
            categorieDepense,
            userEmail,
            montant
          );
        }
        if (sousCategorie) {
          await this.ajouterSeuilSousCategorie(
            sousCategorie,
            userEmail,
            montant
          );
        }
        await this.ajouterTransactions(
          transactions,
          depense.idDepense,
          userEmail
        );

        this.scheduleNotificationTask(
          depense.idDepense,
          userEmail,
          dateDepense
        );
      } catch (error) {
        console.error("Error scheduling quarterly task:", error);
      }
    });

    this.scheduledTasks[idDepense] = task;
    console.log("Tâche trimestrielle planifiée");
  }

  private async scheduleHalfYearlyTask(
    idDepense: number,
    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateDepense: string,
    categorieDepense: number,
    sousCategorie: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  ) {
    const task = schedule("0 0 1 */6 *", async () => {
      try {
        const newDateDepense: Date = new Date(dateDepense);
        const newDate: Date = addMonths(newDateDepense, 6);
        dateDepense = newDate.toISOString();

        const depense = await this.ajouterDepense({
          recurrente,
          recurrenceOption,
          description,
          dateDepense,
          categorieDepense,
          sousCategorie,
          fournisseur,
          montant,
          transactions,
          userEmail,
        });
        if (categorieDepense) {
          await this.ajouterSeuilCategorie(
            categorieDepense,
            userEmail,
            montant
          );
        }
        if (sousCategorie) {
          await this.ajouterSeuilSousCategorie(
            sousCategorie,
            userEmail,
            montant
          );
        }
        await this.ajouterTransactions(
          transactions,
          depense.idDepense,
          userEmail
        );

        this.scheduleNotificationTask(
          depense.idDepense,
          userEmail,
          dateDepense
        );
      } catch (error) {
        console.error("Error scheduling half-yearly task:", error);
      }
    });

    this.scheduledTasks[idDepense] = task;
    console.log("Tâche semestrielle planifiée");
  }

  private async scheduleYearlyTask(
    idDepense: number,
    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateDepense: string,
    categorieDepense: number,
    sousCategorie: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  ) {
    const task = schedule("0 0 1 1 *", async () => {
      try {
        const newDateDepense: Date = new Date(dateDepense);
        const newDate: Date = addYears(newDateDepense, 1);
        dateDepense = newDate.toISOString();

        const depense = await this.ajouterDepense({
          recurrente,
          recurrenceOption,
          description,
          dateDepense,
          categorieDepense,
          sousCategorie,
          fournisseur,
          montant,
          transactions,
          userEmail,
        });
        if (categorieDepense) {
          await this.ajouterSeuilCategorie(
            categorieDepense,
            userEmail,
            montant
          );
        }
        if (sousCategorie) {
          await this.ajouterSeuilSousCategorie(
            sousCategorie,
            userEmail,
            montant
          );
        }
        await this.ajouterTransactions(
          transactions,
          depense.idDepense,
          userEmail
        );

        this.scheduleNotificationTask(
          depense.idDepense,
          userEmail,
          dateDepense
        );
      } catch (error) {
        console.error("Error scheduling yearly task:", error);
      }
    });

    this.scheduledTasks[idDepense] = task;
    console.log("Tâche annuelle planifiée");
  }

  private async scheduleNotificationTask(
    idDepense: number,
    userEmail: string,
    dateDepense: string
  ) {
    console.log("dateDepense", dateDepense);
    const notificationDate = addMinutes(new Date(), 2); // Notification après deux minutes
    const cronExpression = `${notificationDate.getMinutes()} ${notificationDate.getHours()} ${notificationDate.getDate()} ${
      notificationDate.getMonth() + 1
    } *`;
    console.log("cronExpression", cronExpression);

    const task = schedule(cronExpression, async () => {
      try {
        await this.repository.ajouterNotificationsPeriodiques(
          idDepense,
          userEmail
        );
      } catch (error) {
        console.error("Error scheduling notification task:", error);
      }
    });

    this.notificationTasks[idDepense] = task;
    console.log("Tâche de notification planifiée pour deux minutes plus tard");
  }
}
