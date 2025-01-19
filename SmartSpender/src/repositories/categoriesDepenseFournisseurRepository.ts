import { mysqlClient } from "../dbConnection";
import { CategorieDepenseFournisseur } from "../entities/CategorieDepenseFournisseur";
import { Buffer } from "buffer";
import { ICategorieDepenseFournisseurRepository } from "../interfaces/ICategorieDepenseFournisseurRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";

@injectable()
export class CategorieDepenseFournisseurRepository
  implements ICategorieDepenseFournisseurRepository
{
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async findAll(
    idCategorieDepense: number
  ): Promise<CategorieDepenseFournisseur[]> {
    let query = `SELECT * FROM categoriesDepenseFournisseur WHERE idCategorieDepense = ? AND deleted = 0;`;
    const values: any[] = [idCategorieDepense];

    return new Promise<CategorieDepenseFournisseur[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets CategorieDepenseFournisseur
          const categories = results.map((row: any) => {
            return new CategorieDepenseFournisseur(
              row.idCategorieDepenseFournisseur,
              row.idCategorieDepense,
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
