import { User } from "./../entities/User";
import { CategorieDepense } from "./../entities/CategorieDepense";
import { mysqlClient } from "../dbConnection";
import { Seuil } from "../entities/Seuil";
import { ISeuilRepository } from "../interfaces/ISeuilRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";
import { promisify } from "util";

@injectable()
export class SeuilRepository implements ISeuilRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async create({
    userEmail,
    montant,
    periode,
    categorieOuSousCategorie,
    idCategorieOuSousCategorie,
    dateFin, // Ajoutez dateFin ici
  }: Seuil): Promise<Seuil> {
    return new Promise<Seuil>((resolve, reject) => {
      const values = [
        userEmail,
        montant,
        periode,
        categorieOuSousCategorie,
        idCategorieOuSousCategorie,
        dateFin, // Ajoutez dateFin ici
      ];

      const query = `INSERT INTO seuils (userEmail, montantSeuil, periode, categorieOuSousCategorie, idCategorieOuSousCategorie, dateFin) VALUES (?, ?, ?, ?, ?, ?)`;

      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const seuilId = results.insertId;

          const newSeuil = new Seuil(
            seuilId,
            results.createdAt,
            results.updatedAt,
            results.deletedAt,
            results.deleted,
            results.categorieOuSousCategorie,
            results.montantSeuil,
            results.sommeMontants,
            results.periode,
            results.idCategorieOuSousCategorie,
            results.userEmail,
            results.imageCategorieOuSousCategorie,
            results.nomCategorieOuSousCategorie,
            results.dateFin // Ajoutez dateFin ici
          );

          resolve(newSeuil);
        }
      });
    });
  }

  async update(id: number, montant: number, periode: string): Promise<Seuil> {
    const query = `UPDATE seuils SET montantSeuil = ?, periode = ? WHERE IdSousCategorie = ?`;
    const values = [montant, periode, id];
    return new Promise<Seuil>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  async delete(id: number): Promise<boolean> {
    const query = ` UPDATE seuils SET deleted = 1 WHERE idSeuil = ?`;
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
  async findAll(userEmail: string): Promise<any[]> {
    let query = `
        SELECT 
            seuils.*,
            categoriesDepense.nomCategorie AS nomCategorie,
            sousCategoriesDepense.nomSousCategorie AS nomSousCategorie
        FROM 
            seuils
        LEFT JOIN 
            categoriesDepense ON seuils.idCategorieOuSousCategorie = categoriesDepense.IdCategorie
        LEFT JOIN 
            sousCategoriesDepense ON seuils.idCategorieOuSousCategorie = sousCategoriesDepense.IdSousCategorie
        WHERE 
            seuils.userEmail = ? AND seuils.deleted = 0 
    `;
    const values: any[] = [userEmail];

    return new Promise<any[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets appropriés
          const mappedResults = results.map((row: any) => {
            return {
              idSeuil: row.idSeuil,
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
              deletedAt: row.deletedAt,
              deleted: row.deleted,
              categorieOuSousCategorie: row.categorieOuSousCategorie,
              montantSeuil: row.montantSeuil,
              sommeMontants: row.sommeMontants,
              periode: row.periode,
              idCategorieOuSousCategorie: row.idCategorieOuSousCategorie,
              userEmail: row.userEmail,
              nomCategorieOuSousCategorie:
                row.nomCategorie || row.nomSousCategorie, // Utilisation du nom de catégorie ou de sous-catégorie
              dateFin: row.dateFin,
            };
          });
          resolve(mappedResults);
          console.log(mappedResults);
        }
      });
    });
  }

  async findById(id: number): Promise<Seuil | null> {
    const query = `SELECT 
                      s.*, 
                      IF(s.categorieOuSousCategorie = 'Categorie', c.image, sc.image) AS image,
                      IF(s.categorieOuSousCategorie = 'Categorie', c.nomCategorie, sc.nomSousCategorie) AS nomCategorieOuSousCategorie
                   FROM 
                      seuils s
                      LEFT JOIN categoriesDepense c ON s.categorieOuSousCategorie = 'Categorie' AND s.idCategorieOuSousCategorie = c.IdCategorie
                      LEFT JOIN sousCategoriesDepense sc ON s.categorieOuSousCategorie = 'SousCategorie' AND s.idCategorieOuSousCategorie = sc.IdSousCategorie
                   WHERE 
                      s.idSeuil = ?`;
    const values = [id];
    return new Promise<Seuil | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Aucune catégorie ou sous-catégorie trouvée avec cet ID
          } else {
            const row = results[0];
            const seuil = new Seuil(
              row.idSeuil,
              row.createdAt,
              row.updatedAt,
              row.deletedAt,
              row.deleted,
              row.categorieOuSousCategorie,
              row.montantSeuil,
              row.sommeMontants,
              row.periode,
              row.idCategorieOuSousCategorie,
              row.userEmail,
              row.image,
              row.nomCategorieOuSousCategorie, // Ajout du nom de la catégorie ou de la sous-catégorie
              row.dateFin
            );
            resolve(seuil);
          }
        }
      });
    });
  }
  async getDifferencesForCategory(
    categorieDepense: number,
    userEmail: string
  ): Promise<number[]> {
    try {
      // Récupérer tous les seuils pour la catégorie spécifiée
      const thresholds = await this.getThresholds(categorieDepense, userEmail);

      // Calculer les différences pour la catégorie
      const differences = await this.calculateDifferences(thresholds);

      return differences;
    } catch (error) {
      console.error("Error retrieving differences:", error);
      throw error;
    }
  }

  private async getThresholds(
    categorieDepense: number,
    userEmail: string
  ): Promise<any[]> {
    const query = `
      SELECT idSeuil, montantSeuil, periode, createdAt, sommeMontants
      FROM seuils 
      WHERE idCategorieOuSousCategorie = ? 
      AND categorieOuSousCategorie = "categorie"
      AND userEmail = ? 
      AND deleted = 0
    `;

    const values = [categorieDepense, userEmail];

    return new Promise<any[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  private async calculateDifferences(thresholds: any[]): Promise<number[]> {
    const currentDate = new Date();
    const differences: number[] = [];

    for (const threshold of thresholds) {
      const createdAt = new Date(threshold.createdAt);
      const interval = this.calculateInterval(threshold.periode);

      if (currentDate <= new Date(createdAt.getTime() + interval)) {
        differences.push(threshold.montantSeuil - threshold.sommeMontants);
      }
    }

    return differences;
  }

  private calculateInterval(periode: string): number {
    switch (periode) {
      case "mois":
        return 1 * 30 * 24 * 60 * 60 * 1000; // 1 mois en millisecondes
      case "3mois":
        return 3 * 30 * 24 * 60 * 60 * 1000; // 3 mois en millisecondes
      case "6mois":
        return 6 * 30 * 24 * 60 * 60 * 1000; // 6 mois en millisecondes
      case "an":
        return 1 * 365 * 24 * 60 * 60 * 1000; // 1 an en millisecondes
      default:
        return 0; // Valeur par défaut
    }
  }
  async getDifferencesForSubCategory(
    sousCategorie: number,
    userEmail: string
  ): Promise<number[]> {
    try {
      // Récupérer tous les seuils pour la sous-catégorie spécifiée
      const thresholds = await this.getThresholdsForSubCategory(
        sousCategorie,
        userEmail
      );
      console.log("thresholds ", thresholds);
      console.log("fin consolation");
      // Calculer les différences pour la sous-catégorie
      const differences = await this.calculateDifferences(thresholds);

      return differences;
    } catch (error) {
      console.error("Error retrieving differences:", error);
      throw error;
    }
  }

  private async getThresholdsForSubCategory(
    sousCategorie: number,
    userEmail: string
  ): Promise<any[]> {
    const query = `
      SELECT idSeuil, montantSeuil, periode, createdAt, sommeMontants
      FROM seuils 
      WHERE idCategorieOuSousCategorie = ? 
      AND categorieOuSousCategorie = "sousCategorie"
      AND userEmail = ? 
      AND deleted = 0
    `;

    const values = [sousCategorie, userEmail];

    return new Promise<any[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}
