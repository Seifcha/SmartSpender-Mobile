import { mysqlClient } from "../dbConnection";
import { CategorieRevenuFournisseur } from "../entities/CategorieRevenuFournisseur";
import { Buffer } from "buffer";
import { ICategorieRevenuFournisseurRepository } from "../interfaces/ICategorieRevenuFournisseurRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";

@injectable()
export class CategorieRevenuFournisseurRepository
  implements ICategorieRevenuFournisseurRepository
{
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async findAll(
    idCategorieRevenu: number
  ): Promise<CategorieRevenuFournisseur[]> {
    let query = `SELECT * FROM categoriesRevenuFournisseur WHERE idCategorieRevenu = ? AND deleted = 0;`;
    const values: any[] = [idCategorieRevenu];

    return new Promise<CategorieRevenuFournisseur[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets CategorieRevenuFournisseur
          const categories = results.map((row: any) => {
            return new CategorieRevenuFournisseur(
              row.idCategorieRevenuFournisseur,
              row.idCategorieRevenu,
              row.idCategorieFournisseur,
              row.createdAt,
              row.updatedAt,
              row.deletedAt,
              row.deleted
            );
          });
          resolve(categories);
        }
      });
    });
  }
}
