import { mysqlClient } from "../dbConnection";
import { CategorieFournisseur } from "../entities/CategorieFournisseur";
import { ICategorieFournisseurRepository } from "../interfaces/ICategorieFournisseurRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";
import { Buffer } from "buffer";

@injectable()
export class CategorieFournisseurRepository
  implements ICategorieFournisseurRepository
{
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async findAll(
    limit: number | undefined,
    offset: number
  ): Promise<CategorieFournisseur[]> {
    let query = `SELECT * FROM categoriesFournisseur WHERE deleted = 0; `;
    const values: any[] = [];

    // if (limit !== undefined) {
    //     query += ` LIMIT ?`;
    //     values.push(limit);
    // }
    // if (offset) {
    //     query += ` OFFSET ?`;
    //     values.push(offset);
    // }

    return new Promise<CategorieFournisseur[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des ob
          const categories = results.map((row: any) => {
            return new CategorieFournisseur(
              row.IdCategorieFournisseur,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nomCategorie,
              row.image
            );
          });
          resolve(categories);
        }
      });
    });
  }
  async findById(id: number): Promise<CategorieFournisseur | null> {
    const query = `SELECT * FROM categoriesFournisseur WHERE IdCategorieFournisseur = ?`;
    const values = [id];
    return new Promise<CategorieFournisseur | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Aucune catégorie trouvée avec cet ID
          } else {
            const row = results[0];
            const categorie = new CategorieFournisseur(
              row.IdCategorieFournisseur,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nomCategorie,
              row.image
            );
            resolve(categorie);
          }
        }
      });
    });
  }
}
