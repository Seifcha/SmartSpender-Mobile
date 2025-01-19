import { mysqlClient } from "../dbConnection";
import { ITransfertRepository } from "../interfaces/ITransfertRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";
import { Transfert } from "../entities/Transfert";

@injectable()
export class TransfertRepository implements ITransfertRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }
  async findAll(userEmail: string): Promise<Transfert[]> {
    let query = `SELECT * FROM transferts WHERE deleted = 0 and userEmail=?`;
    const values: any[] = [userEmail];

    return new Promise<Transfert[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets Transfert
          const transferts: Transfert[] = results.map((row: any) => {
            return new Transfert(
              row.idTransfert,
              row.createdAt, // createdAt
              row.updatedAt, // updatedAt
              row.deleted, // deleted
              row.deletedAt, // deletedAt
              row.date,
              row.montant,
              row.description, // typeTransfert
              row.idDeCompte,
              row.idVersCompte,
              row.userEmail // dateExpiration
            );
          });
          resolve(transferts);
        }
      });
    });
  }
  async checkMontant(
    montant: number,
    DeCompte: number,
    userEmail: string
  ): Promise<boolean> {
    const query = `
      SELECT solde, creditLign, typeCompte 
      FROM comptes 
      WHERE idCompte = ? AND userEmail = ? AND deleted = 0
    `;
    const values = [DeCompte, userEmail];

    return new Promise<boolean>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            reject(new Error("Compte source non trouvé"));
            return;
          }

          const { solde, creditLign, typeCompte } = results[0];
          let disponible = solde;

          // Pour les comptes de crédit, ajouter la ligne de crédit au solde disponible
          if (
            typeCompte === "compte_credit" ||
            typeCompte === "compte_courant"
          ) {
            disponible = creditLign + disponible;
          }

          // Vérifier si le montant du transfert peut être couvert
          const peutTransferer = disponible >= montant;

          resolve(peutTransferer);
        }
      });
    });
  }

  async ajouterTransfert({
    description,
    dateTransfert,
    DeCompte,
    VersCompte,
    montant,
    userEmail,
  }: Transfert): Promise<Transfert> {
    return new Promise<Transfert>((resolve, reject) => {
      // Commencer une transaction
      this.connection.beginTransaction((transactionError) => {
        if (transactionError) {
          return reject(transactionError);
        }

        const insertQuery = `INSERT INTO transferts (description, date, idDeCompte, idVersCompte, montant, userEmail) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
          description,
          dateTransfert,
          DeCompte,
          VersCompte,
          montant,
          userEmail,
        ];

        this.connection.query(insertQuery, values, (insertError, results) => {
          if (insertError) {
            return this.connection.rollback(() => reject(insertError));
          }

          // Mettre à jour le solde du compte d'origine (DeCompte)
          const updateDeCompteQuery = `UPDATE comptes SET solde = solde - ? WHERE idCompte = ?`;
          this.connection.query(
            updateDeCompteQuery,
            [montant, DeCompte],
            (updateDeCompteError) => {
              if (updateDeCompteError) {
                return this.connection.rollback(() =>
                  reject(updateDeCompteError)
                );
              }

              // Mettre à jour le solde du compte de destination (VersCompte)
              const updateVersCompteQuery = `UPDATE comptes SET solde = solde + ? WHERE idCompte = ?`;
              this.connection.query(
                updateVersCompteQuery,
                [montant, VersCompte],
                (updateVersCompteError) => {
                  if (updateVersCompteError) {
                    return this.connection.rollback(() =>
                      reject(updateVersCompteError)
                    );
                  }

                  // Confirmer la transaction
                  this.connection.commit((commitError) => {
                    if (commitError) {
                      return this.connection.rollback(() =>
                        reject(commitError)
                      );
                    }

                    // Récupérer l'ID de la dépense nouvellement insérée
                    const transfertId = results.insertId;

                    // Créer une nouvelle instance de Transfert avec les données insérées
                    const newTransfert = new Transfert(
                      transfertId,
                      results.createdAt,
                      results.updatedAt,
                      results.deleted,
                      results.deletedAt,
                      dateTransfert,
                      montant,
                      description,
                      DeCompte,
                      VersCompte,
                      userEmail
                    );

                    // Résoudre avec la nouvelle instance de Transfert
                    resolve(newTransfert);
                  });
                }
              );
            }
          );
        });
      });
    });
  }

  async findById(id: number): Promise<any> {
    const queryTransfert = `SELECT * FROM transferts WHERE idTransfert = ?`;
    const queryCompte = `SELECT nomCompte FROM comptes WHERE idCompte = ?`;

    const valuesTransfert = [id];

    return new Promise<any>((resolve, reject) => {
      this.connection.query(
        queryTransfert,
        valuesTransfert,
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            if (results.length === 0) {
              resolve(null); // Aucun transfert trouvé avec cet ID
            } else {
              const transfert = results[0];

              // Récupérer les noms des comptes
              const valuesCompteDe = [transfert.idDeCompte];
              const valuesCompteVers = [transfert.idVersCompte];

              this.connection.query(
                queryCompte,
                valuesCompteDe,
                (error, resultsDe) => {
                  if (error) {
                    reject(error);
                  } else {
                    const deCompteNom =
                      resultsDe[0]?.nomCompte || "Compte inconnu";

                    this.connection.query(
                      queryCompte,
                      valuesCompteVers,
                      (error, resultsVers) => {
                        if (error) {
                          reject(error);
                        } else {
                          const versCompteNom =
                            resultsVers[0]?.nomCompte || "Compte inconnu";

                          // Inclure les noms des comptes dans la réponse
                          resolve({
                            ...transfert,
                            deCompteNom,
                            versCompteNom,
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        }
      );
    });
  }

  async delete(id: number): Promise<boolean> {
    const query = `UPDATE transferts SET deleted = 1 WHERE idTransfert = ?`;
    const values = [id];
    return new Promise<boolean>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(true); // Succès de la suppression
        }
      });
    });
  }
}
