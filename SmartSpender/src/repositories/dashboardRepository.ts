// import { mysqlClient } from "../dbConnection";
// // import { SousDashboard } from "../entities/SousDashboard";
// // import { Buffer } from "buffer";
// import { IDashboardRepository } from "../interfaces/IDashboardRepository";
// import { injectable } from "inversify";
// import * as mysql from "mysql";

// @injectable()
// export class DashboardRepository implements IDashboardRepository {
//   private connection: mysql.Connection;

//   constructor() {
//     this.connection = mysqlClient();
//   }
//   //   validate(id: number): Promise<Dashboard> {
//   //     throw new Error("Method not implemented.");
//   //   }

//   async getSommeMontants(
//     userEmail: string
//   ): Promise<{ date: string; sommeSolde: number }[]> {
//     const query = `
//       SELECT
//         DATE_FORMAT(updatedAt, '%Y-%m-%d %H:%i:%s') AS date,
//         SUM(solde) AS sommeSolde
//       FROM comptes
//       WHERE userEmail = ? AND deleted = 0
//       GROUP BY DATE_FORMAT(updatedAt, '%Y-%m-%d %H:%i:%s')
//     `;
//     const values = [userEmail];

//     return new Promise<{ date: string; sommeSolde: number }[]>(
//       (resolve, reject) => {
//         this.connection.query(query, values, (error, results) => {
//           if (error) {
//             reject(error);
//           } else {
//             const result = results.map((row: any) => ({
//               date: row.date,
//               sommeSolde: parseFloat(row.sommeSolde),
//             }));
//             resolve(result);
//           }
//         });
//       }
//     );
//   }
// }

import { mysqlClient } from "../dbConnection";
import { IDashboardRepository } from "../interfaces/IDashboardRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";

@injectable()
export class DashboardRepository implements IDashboardRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async getSommeMontants(
    userEmail: string
  ): Promise<{ date: string; cumulative_balance: number }[]> {
    const query = `
    SELECT createdAt , sommeMontant FROM sommeMontants WHERE userEmail = ?
    `;
    const values = [userEmail, userEmail, userEmail];

    return new Promise<{ date: string; cumulative_balance: number }[]>(
      (resolve, reject) => {
        this.connection.query(query, values, (error, results) => {
          if (error) {
            reject(error);
          } else {
            const result = results.map((row: any) => ({
              date: row.createdAt,
              cumulative_balance: parseFloat(row.sommeMontant),
            }));
            resolve(result);
          }
        });
      }
    );
  }

  async getSommeDepense(
    userEmail: string
  ): Promise<
    { idCategorie: number; nomCategorie: string; sommeMontant: number }[]
  > {
    const query = `
      SELECT c.IdCategorie, c.nomCategorie, SUM(d.montant) AS sommeMontant
      FROM depenses d
      JOIN categoriesDepense c ON d.idCategorieDepense = c.IdCategorie
      WHERE d.userEmail = ?
      GROUP BY c.IdCategorie, c.nomCategorie
    `;
    const values = [userEmail];

    return new Promise<
      { idCategorie: number; nomCategorie: string; sommeMontant: number }[]
    >((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const result = results.map((row: any) => ({
            idCategorie: row.IdCategorie,
            nomCategorie: row.nomCategorie,
            sommeMontant: parseFloat(row.sommeMontant),
          }));
          resolve(result);
        }
      });
    });
  }
  async getSommeRevenu(
    userEmail: string
  ): Promise<
    { idCategorie: number; nomCategorie: string; sommeMontant: number }[]
  > {
    const query = `
      SELECT c.IdCategorie, c.nomCategorie, SUM(d.montant) AS sommeMontant
      FROM revenus d
      JOIN categoriesRevenu c ON d.idCategorieRevenu = c.IdCategorie
      WHERE d.userEmail = ?
      GROUP BY c.IdCategorie, c.nomCategorie
    `;
    const values = [userEmail];

    return new Promise<
      { idCategorie: number; nomCategorie: string; sommeMontant: number }[]
    >((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const result = results.map((row: any) => ({
            idCategorie: row.IdCategorie,
            nomCategorie: row.nomCategorie,
            sommeMontant: parseFloat(row.sommeMontant),
          }));
          resolve(result);
        }
      });
    });
  }

  async getFournisseurRevenuEtDepense(
    userEmail: string
  ): Promise<
    {
      idFournisseur: number;
      nom: string;
      sommeRevenu: number;
      sommeDepense: number;
    }[]
  > {
    const query = `
      SELECT
        f.IdFournisseur,
        f.nom,
        COALESCE(revenus.sommeMontant, 0) AS sommeRevenu,
        COALESCE(depenses.sommeMontant, 0) AS sommeDepense
      FROM
        fournisseurs f
      LEFT JOIN (
        SELECT
          idFournisseur,
          SUM(montant) AS sommeMontant
        FROM
          revenus
        WHERE
          userEmail = ?
        GROUP BY
          idFournisseur
      ) AS revenus ON f.IdFournisseur = revenus.idFournisseur
      LEFT JOIN (
        SELECT
          idFournisseur,
          SUM(montant) AS sommeMontant
        FROM
          depenses
        WHERE
          userEmail = ?
        GROUP BY
          idFournisseur
      ) AS depenses ON f.IdFournisseur = depenses.idFournisseur
      WHERE
        f.IdFournisseur IN (
          SELECT idFournisseur
          FROM revenus
          WHERE userEmail = ?
          UNION
          SELECT idFournisseur
          FROM depenses
          WHERE userEmail = ?
        )
    `;
    const values = [userEmail, userEmail, userEmail, userEmail];

    return new Promise<
      {
        idFournisseur: number;
        nom: string;
        sommeRevenu: number;
        sommeDepense: number;
      }[]
    >((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const result = results.map((row: any) => ({
            idFournisseur: row.IdFournisseur,
            nom: row.nom,
            sommeRevenu: parseFloat(row.sommeRevenu),
            sommeDepense: parseFloat(row.sommeDepense),
          }));
          resolve(result);
        }
      });
    });
  }
}
