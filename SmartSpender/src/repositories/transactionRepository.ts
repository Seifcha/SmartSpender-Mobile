import { CategorieDepense } from "./../entities/CategorieDepense";
import { mysqlClient } from "../dbConnection";
import { Depense } from "../entities/Depense";
import { Seuil } from "../entities/Seuil";
import { Transaction } from "../entities/Transaction";
// import { SousDepense } from "../entities/SousDepense";
// import { Buffer } from "buffer";
import { ITransactionRepository } from "../interfaces/ITransactionRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";
import { promisify } from "util";

@injectable()
export class TransactionRepository implements ITransactionRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async findAll(id: number): Promise<
    {
      moyen: string;
      nomCompte: string;
      nomCarte: string;
      amount: number;
    }[]
  > {
    console.log(id);
    const query = `
    SELECT 
      t.moyenPaiement AS moyen, 
      t.montant AS amount,
      cpt.nomCompte AS nomCompte, 
      crt.numeroCarte AS nomCarte
    FROM transactions t
    LEFT JOIN comptes cpt ON t.idCompte = cpt.idCompte
    LEFT JOIN cartes crt ON t.idCarte = crt.idCarte
    WHERE t.idDepense = ?
  `;
    const values: any[] = [id];

    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          //   if (results.length === 0) {
          //     resolve([]); // No transactions found with this idDepense
          //   } else {
          const result = results.map((row: any) => ({
            moyen: row.moyen,
            nomCompte: row.nomCompte || "",
            nomCarte: row.nomCarte || "",
            amount: parseFloat(row.amount),
          }));
          resolve(result);
          console.log("results", result);
        }
      });
    });
  }
  async findAllRevenu(id: number): Promise<
    {
      moyen: string;
      nomCompte: string;
      amount: number;
    }[]
  > {
    console.log(id);
    const query = `
    SELECT 
      t.moyenPaiement AS moyen, 
      t.montant AS amount,
      cpt.nomCompte AS nomCompte 
    FROM transactions t
    LEFT JOIN comptes cpt ON t.idCompte = cpt.idCompte
    WHERE t.idRevenu = ?
  `;
    const values: any[] = [id];

    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          //   if (results.length === 0) {
          //     resolve([]); // No transactions found with this idDepense
          //   } else {
          const result = results.map((row: any) => ({
            moyen: row.moyen,
            nomCompte: row.nomCompte || "",
            amount: parseFloat(row.amount),
          }));
          resolve(result);
          console.log("results", result);
        }
      });
    });
  }
}
//   async findAll(userEmail): Promise<Depense[]> {
//     try {
//       // Exécuter d'abord la requête pour les catégories de dépenses publiques valides
//       const publics = await this.findAllByVisibility(true);
//       // Ensuite, exécuter la requête pour les catégories de dépenses non publiques valides avec l'email de l'utilisateur
//       const nonPublics = await this.findAllByVisibility(
//         false,
//         userEmail
//       );

//       // Combiner les résultats et les retourner
//       return [...publics, ...nonPublics];
//     } catch (error) {
//       // Gérer les erreurs
//       throw error;
//     }
//   }

//   async findAllByVisibility(
//     isValid: boolean,
//     userEmail?: string
//   ): Promise<Depense[]> {
//     let query = `SELECT * FROM sDepense WHERE deleted = 0 AND valide = ?`;
//     const values: any[] = [isValid ? 1 : 0];

//     // Si userEmail est fourni, ajouter la clause userEmail à la requête
//     if (userEmail) {
//       query += ` AND userEmail = ?`;
//       values.push(userEmail);
//     }

//     return new Promise<Depense[]>((resolve, reject) => {
//       this.connection.query(query, values, (error, results) => {
//         if (error) {
//           reject(error);
//         } else {
//           // Mapper les résultats de la requête sur des objets Depense
//           const s = results.map((row: any) => {
//             return new Depense(
//               row.Id,
//               row.createdAt,
//               row.updatedAt,
//               row.deleted,
//               row.deletedAt,
//               row.nom,
//               row.isPublic,
//               row.valide,
//               row.image,
//               row.possedeFournisseurDepense,
//               row.Seuil,
//               row.userEmail
//             );
//           });
//           resolve(s);
//         }
//       });
//     });
//   }

//   async findById(id: number): Promise<Depense | null> {
//     const query = `SELECT * FROM sDepense WHERE Id = ?`;
//     const values = [id];
//     return new Promise<Depense | null>((resolve, reject) => {
//       this.connection.query(query, values, (error, results) => {
//         if (error) {
//           reject(error);
//         } else {
//           if (results.length === 0) {
//             resolve(null); // Aucune catégorie trouvée avec cet ID
//           } else {
//             const row = results[0];
//             const  = new Depense(
//               row.Id,
//               row.createdAt,
//               row.updatedAt,
//               row.deleted,
//               row.deletedAt,
//               row.nom,
//               row.isPublic,
//               row.valide,
//               row.image,
//               row.possedeFournisseurDepense,
//               row.Seuil,
//               row.userEmail
//             );
//             resolve();
//           }
//         }
//       });
//     });
//   }

//   async update(
//     id: number,
//     nom: string,
//     image: string
//   ): Promise<Depense> {
//     const query = `UPDATE sDepense SET nom = ?, image = ?, updatedAt = CURRENT_TIMESTAMP WHERE Id = ?`;
//     const values = [nom, image, id];
//     return new Promise<Depense>((resolve, reject) => {
//       this.connection.query(query, values, (error, results) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(results);
//         }
//       });
//     });
//   }

// Méthode pour récupérer toutes les sous-catégories associées à une catégorie de dépenses
// async getSoussById(
//   id: number
// ): Promise<SousDepense[]> {
//   const query = `SELECT * FROM soussDepense WHERE idDepense = ?`;
//   const values = [id];
//   return new Promise<SousDepense[]>((resolve, reject) => {
//     this.connection.query(query, values, (error, results) => {
//       if (error) {
//         reject(error);
//       } else {
//         // Mapper les résultats de la requête sur des objets SousDepense
//         const souss: SousDepense[] = results.map(
//           (row: any) => {
//             return new SousDepense(
//               row.IdSous,
//               row.createdAt,
//               row.updatedAt,
//               row.deleted,
//               row.deletedAt,
//               row.nomSous,
//               row.isPublic,
//               row.validated,
//               row.image,
//               row.seuil,
//               row.idDepense
//             );
//           }
//         );
//         resolve(souss);
//       }
//     });
//   });
// }

// // Méthode pour supprimer une sous-catégorie par son ID
// async deleteSubCategory(id: number): Promise<boolean> {
//   const query = `  UPDATE soussDepense SET deleted = 1 , deletedAt = CURRENT_TIMESTAMP WHERE IdSous = ? ;
//     `;
//   const values = [id];
//   return new Promise<boolean>((resolve, reject) => {
//     this.connection.query(query, values, (error, results) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(true); // Succès de la suppression
//       }
//     });
//   });
// }
