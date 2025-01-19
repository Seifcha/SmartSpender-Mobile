import { CategorieRevenu } from "./../entities/CategorieRevenu";
import { mysqlClient } from "../dbConnection";
import { Revenu } from "../entities/Revenu";
import { Transaction } from "../entities/Transaction";
// import { SousRevenu } from "../entities/SousRevenu";
// import { Buffer } from "buffer";
import { IRevenuRepository } from "../interfaces/IRevenuRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";
import { promisify } from "util";

@injectable()
export class RevenuRepository implements IRevenuRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }
  async ajouterRevenu({
    recurrente,
    recurrenceOption,
    description,
    dateRevenu,
    categorieRevenu,
    fournisseur,
    montant,
    userEmail,
  }: Revenu): Promise<Revenu> {
    const query = `INSERT INTO revenus (recurrente, recurrenceOption, description, date, idCategorieRevenu, idFournisseur, montant, userEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      recurrente,
      recurrenceOption,
      description,
      dateRevenu,
      categorieRevenu,
      fournisseur,
      montant,
      userEmail,
    ];

    try {
      await this.connection.beginTransaction(); // Start transaction

      const results: any = await this.executeQuery(query, values);
      const revenuId = results.insertId;

      const newRevenu = new Revenu(
        revenuId,
        results.createdAt,
        results.updatedAt,
        results.deleted,
        results.deletedAt,
        results.date,
        results.montant,
        results.idCategorieRevenu,
        results.idFournisseur,
        results.description,
        results.userEmail,
        results.recurrente,
        results.recurrenceOption
      );

      await this.connection.commit(); // Commit transaction

      return newRevenu;
    } catch (error: any) {
      await this.connection.rollback(); // Rollback transaction in case of error
      throw new Error(`Erreur lors de l'ajout du revenu: ${error.message}`);
    }
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
    idRevenu: number,
    userEmail: string
  ): Promise<Transaction[]> {
    const insertedTransactions: Transaction[] = [];

    for (const [index, transaction] of transactions.entries()) {
      let { moyen, idCpt, idCrt, amount } = transaction;
      if (idCrt == 0) {
        idCrt = null;
      }

      try {
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

        const queryInsertTransaction = `INSERT INTO transactions (montant, type, moyenPaiement, idRevenu, idCompte, idCarte) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [montantMajore, "Revenu", moyen, idRevenu, idCpt, idCrt];
        const insertResults = await this.executeQuery(
          queryInsertTransaction,
          values
        );

        const transactionId = insertResults.insertId;

        const queryUpdateSolde = `UPDATE comptes SET solde = solde + ? WHERE idCompte = ?`;
        await this.executeQuery(queryUpdateSolde, [montantMajore, idCpt]);
        await this.connection.commit();

        const newTransaction = new Transaction(
          transactionId,
          insertResults.createdAt,
          insertResults.updatedAt,
          insertResults.deleted,
          insertResults.deletedAt,
          montantMajore,
          "revenu",
          moyen,
          idRevenu,
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

  async delete(id: number): Promise<boolean> {
    try {
      // Suppression des cartes associées au compte
      await this.deleteAssociatedTransactions(id);

      // Soft delete du compte
      const query = `UPDATE revenus SET deleted = 1 WHERE idRevenu = ?`;
      const values = [id];
      await this.executeQuery(query, values);

      return true; // Succès de la suppression
    } catch (error) {
      throw error;
    }
  }
  private async deleteAssociatedTransactions(idRevenu: number): Promise<void> {
    try {
      const query = `UPDATE transactions SET deleted = 1 WHERE idRevenu = ?`;
      const values = [idRevenu];
      await this.executeQuery(query, values);
    } catch (error) {
      throw error;
    }
  }
  async findAll(userEmail: string): Promise<Revenu[]> {
    let query = `SELECT * FROM revenus WHERE deleted = 0 and userEmail=?`;
    const values: any[] = [userEmail];

    return new Promise<Revenu[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets Revenu
          const revenus: Revenu[] = results.map((row: any) => {
            return new Revenu(
              row.idRevenu,
              row.createdAt, // createdAt
              row.updatedAt, // updatedAt
              row.deleted, // deleted
              row.deletedAt, // deletedAt
              row.date,
              row.montant,
              row.idCategorieRevenu,
              row.idFournisseur, // numeroRevenu
              row.description, // typeRevenu
              row.userEmail, // dateExpiration
              row.recurrente,
              row.recurrenceOption
            );
          });
          resolve(revenus);
        }
      });
    });
  }

  async findById(id: number): Promise<{
    createdAt: string;
    dateRevenu: string;
    recurrente: boolean;
    recurrenceOption: string;
    description: string;
    nomFournisseur: string;
    nomCategorie: string;
  } | null> {
    const query = `
    SELECT 
    d.montant,
  d.createdAt, 
  d.date AS dateRevenu, 
  d.recurrente, 
  d.recurrenceOption, 
  d.description, 
  f.nom AS nomFournisseur,
  c.nomCategorie
FROM revenus d
LEFT JOIN categoriesRevenu c ON d.idCategorieRevenu = c.IdCategorie
LEFT JOIN fournisseurs f ON d.idFournisseur = f.idFournisseur
WHERE d.idRevenu = ?

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
            dateRevenu: row.dateRevenu,
            recurrente: row.recurrente === 1,
            recurrenceOption: row.recurrenceOption,
            description: row.description,
            nomFournisseur: row.nomFournisseur,
            nomCategorie: row.nomCategorie,
          };
          resolve(result);
          console.log("result", result);
        }
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
}

// async ajouterTransactions(
//   transactions: any[],
//   idRevenu: number
// ): Promise<Transaction[]> {
//   return new Promise<Transaction[]>((resolve, reject) => {
//     const insertedTransactions: Transaction[] = [];

//     // Parcourir toutes les transactions pour les ajouter à la base de données
//     transactions.forEach((transaction, index) => {
//       // Récupérer les détails de la transaction
//       let { amount, moyen, idCpt } = transaction;
//       this.getUserEmailFromAccountId(idCpt)
//         .then((userEmail) => {
//           // Début de la transaction pour insérer la transaction et mettre à jour le solde du compte
//           this.connection.beginTransaction((transactionErr) => {
//             if (transactionErr) {
//               reject(transactionErr);
//             } else {
//               // Insérer la transaction dans la base de données
//               const queryInsertTransaction = `INSERT INTO transactions (montant, type, moyenPaiement, idRevenu, idCompte) VALUES (?, ?, ?, ?, ?)`;
//               const values = [amount, "Revenu", moyen, idRevenu, idCpt];
//               this.connection.query(
//                 queryInsertTransaction,
//                 values,
//                 (insertError, results) => {
//                   if (insertError) {
//                     this.connection.rollback(() => {
//                       reject(insertError);
//                     });
//                   } else {
//                     // Récupérer l'ID de la transaction nouvellement insérée
//                     const transactionId = results.insertId;

//                     // Mise à jour du solde du compte
//                     const queryUpdateSolde = `UPDATE comptes SET solde = solde + ? WHERE idCompte = ?`;
//                     this.connection.query(
//                       queryUpdateSolde,
//                       [amount, idCpt],
//                       (updateError) => {
//                         if (updateError) {
//                           this.connection.rollback(() => {
//                             reject(updateError);
//                           });
//                         } else {
//                           this.connection.commit((commitError) => {
//                             if (commitError) {
//                               this.connection.rollback(() => {
//                                 reject(commitError);
//                               });
//                             } else {
//                               // Créer une nouvelle instance de Transaction avec les données insérées
//                               const newTransaction = new Transaction(
//                                 transactionId,
//                                 results.createdAt,
//                                 results.updatedAt,
//                                 results.deleted,
//                                 results.deletedAt,
//                                 0,
//                                 "depense", // Remplacer par le type de transaction approprié
//                                 moyen,
//                                 idRevenu,
//                                 null, // Remplacer par l'ID du revenu si nécessaire
//                                 idCpt,
//                                 0
//                               );

//                               // Ajouter la nouvelle transaction à la liste des transactions insérées
//                               insertedTransactions.push(newTransaction);

//                               // Si toutes les transactions ont été traitées, résoudre avec la liste des transactions insérées
//                               if (
//                                 insertedTransactions.length ===
//                                 transactions.length
//                               ) {
//                                 resolve(insertedTransactions);
//                               }
//                             }
//                           });
//                         }
//                       }
//                     );
//                   }
//                 }
//               );
//             }
//           });
//         })
//         .catch(reject);
//     });
//   });
// }
