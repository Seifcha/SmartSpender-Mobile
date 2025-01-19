import { CategorieDepense } from "./../entities/CategorieDepense";
import { mysqlClient } from "../dbConnection";
import { Depense } from "../entities/Depense";
import { Seuil } from "../entities/Seuil";
import { Transaction } from "../entities/Transaction";
import { Notification } from "../entities/Notification";
// import { Buffer } from "buffer";
import { IDepenseRepository } from "../interfaces/IDepenseRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";
import { promisify } from "util";

@injectable()
export class DepenseRepository implements IDepenseRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }
  async ajouterDepense({
    recurrente,
    recurrenceOption,
    description,
    dateDepense,
    categorieDepense,
    sousCategorie,
    fournisseur,
    montant,
    userEmail,
    transactions,
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
    transactions: any[];
  }): Promise<Depense> {
    const query = `INSERT INTO depenses (recurrente, recurrenceOption, description, date, idCategorieDepense, idSousCategorie, idFournisseur, montant, userEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      recurrente,
      recurrenceOption,
      description,
      dateDepense,
      categorieDepense,
      sousCategorie,
      fournisseur,
      montant,
      userEmail,
    ];

    try {
      await this.connection.beginTransaction(); // Start transaction

      const results = await this.executeQuery(query, values);
      const depenseId = results.insertId;

      const newDepense = new Depense(
        depenseId,
        results.createdAt,
        results.updatedAt,
        results.deleted,
        results.deletedAt,
        results.date,
        results.montant,
        results.idCategorieDepense,
        results.idSousCategorie,
        results.idFournisseur,
        results.description,
        results.userEmail,
        results.recurrente,
        results.recurrenceOption
      );

      // Mise à jour de la somme des montants après l'ajout de toutes les transactions associées à la dépense

      await this.connection.commit(); // Commit transaction

      return newDepense;
    } catch (error: any) {
      await this.connection.rollback(); // Rollback transaction in case of error
      throw new Error(`Erreur lors de l'ajout de la dépense: ${error.message}`);
    }
  }
  private async updateSommeMontants(userEmail: string): Promise<void> {
    const currentDate = new Date().toISOString().split("T")[0];

    const checkUserQuery = `
      SELECT sommeMontant
      FROM sommeMontants
      WHERE DATE(createdAt) = ? AND userEmail = ?
      ORDER BY createdAt DESC
      LIMIT 1
    `;

    const results = await this.executeQuery(checkUserQuery, [
      currentDate,
      userEmail,
    ]);

    const lastSum = results.length > 0 ? results[0].sommeMontant : null;

    // Calcul de la nouvelle somme montante
    const newSumQuery = `
      SELECT SUM(solde) AS newSum FROM comptes WHERE deleted = 0 AND userEmail = ?
    `;

    const newSumResult = await this.executeQuery(newSumQuery, [userEmail]);
    const newSum = newSumResult[0].newSum;

    console.log("lastSum", lastSum);
    console.log("newSum", newSum);

    // Comparaison de la nouvelle somme avec la dernière somme
    if (lastSum !== null && newSum === lastSum) {
      // Si les sommes sont égales, ne rien faire
      return;
    }

    // Ajout d'une nouvelle ligne si les sommes sont différentes
    const insertQuery = `
      INSERT INTO sommeMontants (userEmail, createdAt, sommeMontant)
      VALUES (?, ?, ?)
    `;

    await this.executeQuery(insertQuery, [userEmail, currentDate, newSum]);
  }

  private executeQuery(query: string, values: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  async ajouterTransactions(
    transactions: any[],
    idDepense: number,
    userEmail: string
  ): Promise<Transaction[]> {
    const insertedTransactions: Transaction[] = [];

    for (const [index, transaction] of transactions.entries()) {
      let { moyen, idCpt, idCrt, amount } = transaction;
      if (idCrt == 0) {
        idCrt = null;
      }

      try {
        // const userEmail = await this.getUserEmailFromAccountId(idCpt);
        const queryTypeCompte = `SELECT typeCompte, tauxInteret FROM comptes WHERE idCompte = ?`;
        const results = await this.executeQuery(queryTypeCompte, [idCpt]);

        if (results.length === 0) {
          throw new Error(`Compte non trouvé pour la transaction ${index + 1}`);
        }

        const { typeCompte, tauxInteret } = results[0];
        let montantMajore = amount;

        if (typeCompte === "compte_credit") {
          montantMajore = amount * (1 + tauxInteret / 100);
        }

        await this.connection.beginTransaction();

        const queryInsertTransaction = `INSERT INTO transactions (montant, type, moyenPaiement, idDepense, idCompte, idCarte) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
          montantMajore,
          "Depense",
          moyen,
          idDepense,
          idCpt,
          idCrt,
        ];
        const insertResults = await this.executeQuery(
          queryInsertTransaction,
          values
        );

        const transactionId = insertResults.insertId;

        const queryUpdateSolde = `UPDATE comptes SET solde = solde - ? WHERE idCompte = ?`;
        await this.executeQuery(queryUpdateSolde, [montantMajore, idCpt]);

        await this.connection.commit();

        const newTransaction = new Transaction(
          transactionId,
          insertResults.createdAt,
          insertResults.updatedAt,
          insertResults.deleted,
          insertResults.deletedAt,
          montantMajore,
          "depense",
          moyen,
          idDepense,
          null,
          idCpt,
          idCrt
        );

        insertedTransactions.push(newTransaction);
      } catch (error) {
        await this.connection.rollback();
        throw error;
      }
    }
    await this.updateSommeMontants(userEmail);

    return insertedTransactions;
  }
  async findAll(userEmail: string): Promise<Depense[]> {
    let query = `SELECT * FROM depenses WHERE deleted = 0 and userEmail=?`;
    const values: any[] = [userEmail];

    return new Promise<Depense[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets Depense
          const depenses: Depense[] = results.map((row: any) => {
            return new Depense(
              row.idDepense,
              row.createdAt, // createdAt
              row.updatedAt, // updatedAt
              row.deleted, // deleted
              row.deletedAt, // deletedAt
              row.date,
              row.montant,
              row.idCategorieDepense,
              row.idSousCategorie,
              row.idFournisseur, // numeroDepense
              row.description, // typeDepense
              row.userEmail, // dateExpiration
              row.recurrente,
              row.recurrenceOption
            );
          });
          resolve(depenses);
        }
      });
    });
  }
  async delete(id: number): Promise<boolean> {
    try {
      // Suppression des cartes associées au compte
      await this.deleteAssociatedTransactions(id);

      // Soft delete du compte
      const query = `UPDATE depenses SET deleted = 1 WHERE idDepense = ?`;
      const values = [id];
      await this.executeQuery(query, values);

      return true; // Succès de la suppression
    } catch (error) {
      throw error;
    }
  }

  private async deleteAssociatedTransactions(idDepense: number): Promise<void> {
    try {
      const query = `UPDATE transactions SET deleted = 1 WHERE idDepense = ?`;
      const values = [idDepense];
      await this.executeQuery(query, values);
    } catch (error) {
      throw error;
    }
  }

  // private executeQuery(query: string, values: any[]): Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     this.connection.query(query, values, (error, results) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         resolve();
  //       }
  //     });
  //   });
  // }

  // }
  async checkMontant(transactions: any[], userEmail: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // Créer un dictionnaire pour stocker le montant total correspondant à chaque ID de compte
      const totalAmounts = {};

      // Parcourir toutes les transactions pour calculer le montant total correspondant à chaque ID de compte
      transactions.forEach((transaction) => {
        // Récupérer l'ID du compte de la transaction
        const idCompte = transaction.idCpt;

        // Vérifier si l'ID du compte existe déjà dans le dictionnaire
        if (!totalAmounts[idCompte]) {
          // Si l'ID du compte n'existe pas encore, initialiser le montant total à 0
          totalAmounts[idCompte] = 0;
        }

        // Ajouter le montant de la transaction au montant total correspondant à l'ID du compte
        totalAmounts[idCompte] += transaction.amount;
      });

      // Construire un tableau de promesses pour récupérer les soldes et les lignes de crédit de chaque compte
      const promises = Object.keys(totalAmounts).map((idCompte) => {
        return new Promise((resolve, reject) => {
          // Construire la requête SQL pour obtenir le solde, la ligne de crédit et le type de compte du compte
          const query = `SELECT solde, creditLign, tauxInteret, typeCompte FROM comptes WHERE idCompte = ? and userEmail= ?`;
          const values = [idCompte, userEmail];

          // Exécuter la requête SQL pour obtenir les informations du compte
          this.connection.query(query, values, (error, results) => {
            if (error) {
              reject(error);
            } else {
              // Vérifier si des résultats ont été retournés
              if (results.length === 0) {
                reject(new Error("Compte non trouvé"));
                return;
              }

              // Récupérer le solde, la ligne de crédit, le taux d'intérêt et le type de compte
              const { solde, creditLign, tauxInteret, typeCompte } = results[0];

              // Récupérer le montant total correspondant à cet ID de compte
              let totalAmount = totalAmounts[idCompte];

              // Si le type de compte est "compte_credit", appliquer le taux d'intérêt au montant total
              // if (typeCompte === "compte_credit") {
              //   totalAmount *= 1 + tauxInteret / 100; // Appliquer le taux d'intérêt
              // }

              // Vérifier si la somme des montants dépasse le solde ou la ligne de crédit
              let depasseMontant = false;
              if (typeCompte === "compte_courant") {
                // Vérifier la limite de crédit pour les comptes de type "compte_courant" ou "compte_credit"
                depasseMontant = totalAmount > solde + creditLign;
              } else if (
                typeCompte === "wallet_cash" ||
                typeCompte === "compte_epargne"
              ) {
                // Vérifier le solde pour les autres types de compte
                depasseMontant = totalAmount > solde;
              } else if (typeCompte === "compte_credit") {
                depasseMontant = totalAmount > -solde + creditLign;
              }
              resolve(depasseMontant);
            }
          });
        });
      });

      // Attendre que toutes les requêtes soient terminées
      Promise.all(promises)
        .then((results) => {
          // Vérifier si au moins une des transactions dépasse le solde ou la ligne de crédit
          const depasseMontant = results.some((result) => result === true);
          resolve(depasseMontant);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private async getUserEmailFromAccountId(accountId: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const query = `SELECT userEmail FROM comptes WHERE idCompte = ?`;
      this.connection.query(query, [accountId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            reject(new Error(`Compte non trouvé avec l'ID ${accountId}`));
          } else {
            resolve(results[0].userEmail);
          }
        }
      });
    });
  }

  // async ajouterDepense({
  //   recurrente,
  //   recurrenceOption,
  //   description,
  //   dateDepense,
  //   categorieDepense,
  //   sousCategorie,
  //   fournisseur,
  //   montant,
  //   userEmail,
  //   transactions, // Ajoutez les transactions ici
  // }: {
  //   recurrente: boolean;
  //   recurrenceOption: string;
  //   description: string;
  //   dateDepense: string;
  //   categorieDepense: number;
  //   sousCategorie: number;
  //   fournisseur: number;
  //   montant: number;
  //   userEmail: string;
  //   transactions: any[]; // Type des transactions
  // }): Promise<Depense> {
  //   const query = `INSERT INTO depenses (recurrente, recurrenceOption, description, date, idCategorieDepense, idSousCategorie, idFournisseur, montant, userEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  //   const values = [
  //     recurrente,
  //     recurrenceOption,
  //     description,
  //     dateDepense,
  //     categorieDepense,
  //     sousCategorie,
  //     fournisseur,
  //     montant,
  //     userEmail,
  //   ];

  //   try {
  //     const results = await this.executeQuery(query, values);
  //     const depenseId = results.insertId;

  //     const newDepense = new Depense(
  //       depenseId,
  //       results.createdAt,
  //       results.updatedAt,
  //       results.deleted,
  //       results.deletedAt,
  //       results.date,
  //       results.montant,
  //       results.idCategorieDepense,
  //       results.idSousCategorie,
  //       results.idFournisseur,
  //       results.description,
  //       results.userEmail,
  //       results.recurrente,
  //       results.recurrenceOption
  //     );

  //     // Ajouter les transactions associées à la dépense
  //     await this.ajouterTransactions(transactions, depenseId);

  //     // Mise à jour de la somme des montants après l'ajout de toutes les transactions associées à la dépense
  //     await this.updateSommeMontants(userEmail);

  //     return newDepense;
  //   } catch (error) {
  //     throw new Error(`Erreur lors de l'ajout de la dépense `);
  //   }
  // }

  async ajouterNotificationsPeriodiques(
    idDepense: number,
    userEmail: string
  ): Promise<Notification> {
    console.log("idDepense", idDepense);
    console.log("userEmail", userEmail);
    return new Promise<Notification>((resolve, reject) => {
      const query = `INSERT INTO notifications (Contenu, titre, idDepense, type, userEmail, vu) VALUES (?, ?, ?, ?, ?, ?)`;

      // Convertir l'image en un format approprié pour la base de données (par exemple, Buffer ou Uint8Array)

      const values = [
        "La date d'une dépense récurrente se rapporche",
        "Dépense récurrente",
        idDepense,
        "Dépense",
        userEmail,
        1,
      ];

      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Récupérer l'ID de la dépense nouvellement insérée
          const notificationId = results.insertId;

          // Créer une nouvelle instance de Notification avec les données insérées
          const newNotification = new Notification(
            notificationId,
            results.createdAt,
            results.updatedAt,
            results.deleted,
            results.deletedAt,
            results.userEmail,
            results.titre,
            results.contenu,
            results.image,
            results.nomFournisseur,
            results.vu,
            results.idDepense,
            results.idRevenu,
            results.type
          );

          // Résoudre avec la nouvelle instance de Notification
          resolve(newNotification);
        }
      });
    });
  }

  async ajouterSeuilCategorie(
    categorieDepense: number,
    userEmail: string,
    montant: number
  ): Promise<void> {
    const asyncQuery = promisify(this.connection.query).bind(this.connection);

    try {
      // Vérifier s'il existe des seuils pour cette catégorie de dépenses et cet utilisateur
      const checkQuery = `
        SELECT idSeuil 
        FROM seuils 
        WHERE categorieOuSousCategorie = "categorie" 
        AND idCategorieOuSousCategorie = ${categorieDepense} 
        AND userEmail = "${userEmail}" 
        AND deleted = 0
      `;
      const existingSeuils: { idSeuil: number }[] = (await asyncQuery(
        checkQuery
      )) as any;

      if (existingSeuils.length > 0) {
        // Si des seuils existent, mettre à jour les montants pour chaque seuil trouvé
        for (const seuil of existingSeuils) {
          const updateQuery = `
            UPDATE seuils 
            SET sommeMontants = sommeMontants + ${montant} 
            WHERE idSeuil = ${seuil.idSeuil}
          `;
          await asyncQuery(updateQuery);
        }
      }
    } catch (error) {
      console.error("Error adding threshold:", error);
      throw error;
    }
  }

  async ajouterSeuilSousCategorie(
    sousCategorie: number,
    userEmail: string,
    montant: number
  ): Promise<void> {
    const asyncQuery = promisify(this.connection.query).bind(this.connection);

    try {
      // Vérifier s'il existe des seuils pour cette sous-catégorie et cet utilisateur
      const checkQuery = `
        SELECT idSeuil 
        FROM seuils 
        WHERE categorieOuSousCategorie = "sousCategorie" 
        AND idCategorieOuSousCategorie = ${sousCategorie} 
        AND userEmail = "${userEmail}" 
        AND deleted = 0
      `;
      const existingSeuils: { idSeuil: number }[] = (await asyncQuery(
        checkQuery
      )) as any;

      if (existingSeuils.length > 0) {
        // Si des seuils existent, mettre à jour les montants pour chaque seuil trouvé
        for (const seuil of existingSeuils) {
          const updateQuery = `
            UPDATE seuils 
            SET sommeMontants = sommeMontants + ${montant} 
            WHERE idSeuil = ${seuil.idSeuil}
          `;
          await asyncQuery(updateQuery);
        }
      }
    } catch (error) {
      console.error("Error adding threshold:", error);
      throw error;
    }
  }

  async findById(id: number): Promise<{
    createdAt: string;
    dateDepense: string;
    recurrente: boolean;
    recurrenceOption: string;
    description: string;
    nomFournisseur: string;
    nomSousCategorie: string;
    nomCategorie: string;
  } | null> {
    const query = `
    SELECT 
    d.montant,
  d.createdAt, 
  d.date AS dateDepense, 
  d.recurrente, 
  d.recurrenceOption, 
  d.description, 
  f.nom AS nomFournisseur,
  sc.nomSousCategorie,
  c.nomCategorie
FROM depenses d
LEFT JOIN sousCategoriesDepense sc ON d.idSousCategorie = sc.IdSousCategorie
LEFT JOIN categoriesDepense c ON d.idCategorieDepense = c.IdCategorie
LEFT JOIN fournisseurs f ON d.idFournisseur = f.idFournisseur
WHERE d.idDepense = ?

    `;
    const values = [id];

    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
          // } else {
          //   if (results.length === 0) {
          //     resolve(null); // No record found with this ID
        } else {
          const row = results[0];
          const result = {
            createdAt: row.createdAt,
            montant: row.montant,
            dateDepense: row.dateDepense,
            recurrente: row.recurrente === 1,
            recurrenceOption: row.recurrenceOption,
            description: row.description,
            nomFournisseur: row.nomFournisseur,
            nomSousCategorie: row.nomSousCategorie,
            nomCategorie: row.nomCategorie,
          };
          resolve(result);
          // console.log("result", result);
          //   }
        }
      });
    });
  }
}
