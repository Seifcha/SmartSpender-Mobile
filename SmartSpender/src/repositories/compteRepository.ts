import { mysqlClient } from "../dbConnection";
import { Compte } from "../entities/Compte";
import { ICompteRepository } from "../interfaces/ICompteRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";

@injectable()
export class CompteRepository implements ICompteRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async create({
    solde,
    iban,
    typeCompte,
    status,
    creditLign,
    nomCompte,
    userEmail,
    tauxInteret,
  }: Compte): Promise<Compte> {
    return new Promise<Compte>((resolve, reject) => {
      const query = `INSERT INTO comptes (solde, iban, typeCompte, status,creditLign,nomCompte, userEmail, tauxInteret) VALUES (?, ?, ?,?,?,?, ?,?)`;

      // Convertir l'image en un format approprié pour la base de données (par exemple, Buffer ou Uint8Array)

      const values = [
        solde,
        iban,
        typeCompte,
        status,
        creditLign,
        nomCompte,
        userEmail,
        tauxInteret,
      ];

      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Récupérer l'ID de la catégorie nouvellement insérée
          const compteId = results.insertId;

          // Créer une nouvelle instance de CategorieDepense avec les données insérées
          const newCompte = new Compte(
            compteId,
            results.createdAt,
            results.updatedAt,
            results.deletedAt,
            results.deleted,
            results.solde,
            results.iban,
            results.typeCompte,
            results.status,
            results.creditLign,
            results.nomCompte,
            results.userEmail,
            results.tauxInteret
          );
          this.updateSommeMontants(userEmail)
            .then(() => {
              // Résoudre avec le nouveau compte créé
              resolve(newCompte);
            })
            .catch(reject);
        }
      });
    });
  }
  async findAll(userEmail: string): Promise<Compte[]> {
    let query = `SELECT * FROM comptes WHERE deleted = 0 and userEmail = ?`;
    const values: any[] = [userEmail];

    return new Promise<Compte[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets Compte
          const comptes: Compte[] = results.map((row: any) => {
            return new Compte(
              row.idCompte,
              row.createdAt,
              row.updatedAt,
              row.deletedAt,
              row.deleted,
              row.solde,
              row.iban,
              row.typeCompte,
              row.status,
              row.creditLign,
              row.nomCompte,
              row.userEmail,
              row.tauxInteret
            );
          });
          resolve(comptes);
        }
      });
    });
  }
  async findAllComptesBancaires(
    userEmail: string,
    typeCarte: string
  ): Promise<Compte[]> {
    let query = "";
    let values: any[] = [];

    if (typeCarte === "débit") {
      // Sélectionner les comptes courants
      query = `SELECT * FROM comptes WHERE deleted = 0 AND userEmail = ? AND (typeCompte = 'compte_courant' OR typeCompte = 'compte_epargne')`;
      values = [userEmail];
    } else if (typeCarte === "crédit") {
      // Sélectionner les comptes crédit
      query = `SELECT * FROM comptes WHERE deleted = 0 AND userEmail = ? AND typeCompte = 'compte_credit'`;
      values = [userEmail];
    } else if (typeCarte === "prépayée") {
      // Sélectionner les comptes wallet_cash (prépayés)
      query = `SELECT * FROM comptes WHERE deleted = 0 AND userEmail = ? AND typeCompte = 'wallet_cash'`;
      values = [userEmail];
    } else {
      // Type de carte non reconnu, rejeter la promesse avec une erreur
      return Promise.reject("Type de carte non reconnu");
    }

    return new Promise<Compte[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets Compte
          const comptes: Compte[] = results.map((row: any) => {
            return new Compte(
              row.idCompte,
              row.createdAt,
              row.updatedAt,
              row.deletedAt,
              row.deleted,
              row.solde,
              row.iban,
              row.typeCompte,
              row.status,
              row.creditLign,
              row.nomCompte,
              row.userEmail,
              row.tauxInteret
            );
          });
          resolve(comptes);
        }
      });
    });
  }

  async findById(id: number): Promise<Compte | null> {
    const query = `SELECT * FROM comptes WHERE idCompte = ?`;
    const values = [id];
    return new Promise<Compte | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Aucune sous-catégorie trouvée avec cet ID
          } else {
            const row = results[0];
            const sousCategorie = new Compte(
              row.idCompte,
              row.createdAt,
              row.updatedAt,
              row.deletedAt,
              row.deleted,
              row.solde,
              row.iban,
              row.typeCompte,
              row.status,
              row.creditLign,
              row.nomCompte,
              row.userEmail,
              row.tauxInteret
            );
            resolve(sousCategorie);
          }
        }
      });
    });
  }
  async update(
    solde: number,
    status: string,
    creditLign: number,
    nomCompte: string,
    id: number
  ): Promise<Compte> {
    // Requête pour obtenir l'userEmail à partir de l'idCompte
    const getUserEmailQuery = `SELECT userEmail FROM comptes WHERE idCompte = ?`;
    const userEmailQueryValues = [id];

    return new Promise<Compte>((resolve, reject) => {
      this.connection.query(
        getUserEmailQuery,
        userEmailQueryValues,
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }

          // Vérifier si un utilisateur a été trouvé avec l'idCompte donné
          if (results.length === 0) {
            reject(
              new Error("Aucun utilisateur trouvé avec l'idCompte spécifié")
            );
            return;
          }

          // Récupérer l'userEmail à partir des résultats de la requête SELECT
          const userEmail = results[0].userEmail;

          // Requête pour mettre à jour les détails du compte
          const updateQuery = `UPDATE comptes SET solde = ?, status = ?, creditLign = ?, nomCompte = ? WHERE idCompte = ?`;
          const updateQueryValues = [solde, status, creditLign, nomCompte, id];

          // Exécuter la requête pour mettre à jour les détails du compte
          this.connection.query(
            updateQuery,
            updateQueryValues,
            (error, updateResults) => {
              if (error) {
                reject(error);
                return;
              }

              // Mettre à jour la somme des montants après la mise à jour du compte
              this.updateSommeMontants(userEmail) // Utiliser l'userEmail récupéré
                .then(() => {
                  resolve(updateResults);
                })
                .catch(reject);
            }
          );
        }
      );
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
    // Créer une nouvelle Promise pour encapsuler le code asynchrone
    return new Promise<void>((resolve, reject) => {
      // Date actuelle au format YYYY-MM-DD
      const currentDate = new Date()
        .toISOString()
        .split(".")[0]
        .replace("T", " ");

      // Vérifier si l'utilisateur existe pour la date actuelle
      const checkUserQuery = `
            SELECT COUNT(*) AS userCount
            FROM sommeMontants
            WHERE DATE(createdAt) = '${currentDate}' AND userEmail = ?
        `;

      this.connection.query(checkUserQuery, [userEmail], (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        const userCount = results[0].userCount;

        // if (userCount > 0) {
        //   // L'utilisateur existe pour la date actuelle, exécutez la requête de mise à jour
        // //   INSERT INTO sommeMontants (userEmail, createdAt, sommeMontant)  VALUES (?, ?, (
        // //     SELECT SUM(solde) FROM comptes WHERE (deleted = 0 ) AND userEmail = ?
        // // ))
        //   const updateQuery = `

        //             UPDATE sommeMontants
        //             SET sommeMontant = (
        //                 SELECT SUM(solde) FROM comptes WHERE (deleted = 0 ) AND userEmail = ?
        //             )
        //             WHERE DATE(createdAt) = '${currentDate}' AND userEmail = ?
        //         `;
        //   this.executeQuery(updateQuery, [userEmail, userEmail])
        //     .then(() => resolve())
        //     .catch(reject);
        // } else {
        // L'utilisateur n'existe pas pour la date actuelle, exécutez la requête d'insertion
        const insertQuery = `
                    INSERT INTO sommeMontants (userEmail, createdAt, sommeMontant)
                    VALUES (?, ?, (
                        SELECT SUM(solde) FROM comptes WHERE (deleted = 0 ) AND userEmail = ?
                    ))
                `;
        this.executeQuery(insertQuery, [userEmail, currentDate, userEmail])
          .then(() => resolve())
          .catch(reject);
        // }
      });
    });
  }

  async delete(id: number): Promise<boolean> {
    try {
      const userEmail = await this.getUserEmailFromAccountId(id);

      // Suppression des cartes associées au compte
      await this.deleteAssociatedCards(id);

      // Mise à jour des sommes montants après la suppression du compte
      await this.updateSommeMontants(userEmail);

      // Soft delete du compte
      const query = `UPDATE comptes SET deleted = 1 WHERE idCompte = ?`;
      const values = [id];
      await this.executeQuery(query, values);

      // Succès de la suppression
      return true;
    } catch (error) {
      // En cas d'erreur, propagez l'erreur
      throw error;
    }
  }

  private async deleteAssociatedCards(idCompte: number): Promise<void> {
    try {
      const query = `UPDATE cartes SET deleted = 1 WHERE idCompte = ?`;
      const values = [idCompte];
      await this.executeQuery(query, values);
    } catch (error) {
      throw error;
    }
  }

  private executeQuery(query: string, values: any[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async findAllByType(
    typeCompte: string,
    userEmail: string
  ): Promise<Compte[]> {
    let query = "";
    let values: any[] = [];

    if (typeCompte === "compte_bancaire") {
      // Sélectionner les comptes courants, d'épargne et crédit
      query = `SELECT * FROM comptes WHERE deleted = 0 AND (typeCompte = 'compte_courant' OR typeCompte = 'compte_epargne' OR typeCompte = 'compte_credit') AND userEmail = ?`;
      values = [userEmail];
    } else if (typeCompte === "wallet_cash") {
      // Sélectionner les comptes wallet_cash
      query = `SELECT * FROM comptes WHERE deleted = 0 AND typeCompte = 'wallet_cash' AND userEmail = ?`;
      values = [userEmail];
    } else if (typeCompte === "compte_electronique") {
      // Sélectionner tous les comptes
      query = `SELECT * FROM comptes WHERE deleted = 0 AND userEmail = ?`;
      values = [userEmail];
    } else {
      // Type de compte non reconnu, rejeter la promesse avec une erreur
      return Promise.reject("Type de compte non reconnu");
    }

    return new Promise<Compte[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets Compte
          const comptes: Compte[] = results.map((row: any) => {
            return new Compte(
              row.idCompte,
              row.createdAt,
              row.updatedAt,
              row.deletedAt,
              row.deleted,
              row.solde,
              row.iban,
              row.typeCompte,
              row.status,
              row.creditLign,
              row.nomCompte,
              row.userEmail,
              row.tauxInteret
            );
          });
          resolve(comptes);
        }
      });
    });
  }
}
