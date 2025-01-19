import { mysqlClient } from "../dbConnection";
import { SousCategorieDepense } from "../entities/SousCategorieDepense";
import { ISousCategorieDepenseRepository } from "../interfaces/ISousCategorieDepenseRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";

@injectable()
export class SousCategorieDepenseRepository
  implements ISousCategorieDepenseRepository
{
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async create({
    nomSousCategorie,
    image,
    idCategorieDepense,
    userEmail,
    isPublicInt,
  }: SousCategorieDepense): Promise<SousCategorieDepense> {
    return new Promise<SousCategorieDepense>((resolve, reject) => {
      console.log(nomSousCategorie);
      const query = `INSERT INTO sousCategoriesDepense (nomSousCategorie, image, idCategorieDepense, userEmail, isPublic, validated) VALUES (?, ?, ?, ?,?,0)`;

      // Convertir l'image en un format approprié pour la base de données (par exemple, Buffer ou Uint8Array)

      const values = [
        nomSousCategorie,
        image, // Utiliser le Buffer de l'image
        idCategorieDepense,
        userEmail,
        isPublicInt,
      ];

      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Récupérer l'ID de la catégorie nouvellement insérée
          const categoryId = results.insertId;

          // Créer une nouvelle instance de CategorieDepense avec les données insérées
          const newCategorieDepense = new SousCategorieDepense(
            categoryId,
            new Date(), // Date de création actuelle
            new Date(), // Date de mise à jour actuelle
            false, // Aucune suppression
            new Date(), // Date de suppression nulle
            nomSousCategorie,
            isPublicInt, // Supposons que la catégorie n'est pas publique par défaut
            false, // Supposons que la catégorie n'est pas validée par défaut
            image, // Utiliser le Buffer de l'image
            idCategorieDepense,
            0,
            userEmail,
            false
          );

          // Résoudre avec la nouvelle instance de CategorieDepense
          resolve(newCategorieDepense);
        }
      });
    });
  }
  async findAll(
    userEmail: string,
    idCategorieParente: number
  ): Promise<SousCategorieDepense[]> {
    console.log(idCategorieParente);
    try {
      // Exécuter d'abord la requête pour les sous-catégories de dépenses publiques
      const publicSousCategories = await this.findAllByVisibility(
        idCategorieParente,
        true
      );
      // Ensuite, exécuter la requête pour les sous-catégories de dépenses non publiques
      const nonPublicSousCategories = await this.findAllByVisibility(
        idCategorieParente,
        false,
        userEmail
      );

      return [...publicSousCategories, ...nonPublicSousCategories];
    } catch (error) {
      // Gérer les erreurs
      throw error;
    }
  }
  async findAllByVisibility(
    idCategorieParente: number,
    isValid: boolean,
    userEmail?: string
  ): Promise<SousCategorieDepense[]> {
    let query = `SELECT * FROM sousCategoriesDepense WHERE deleted = 0 AND idCategorieDepense= ? AND validated = ?`;
    const values: any[] = [idCategorieParente, isValid ? 1 : 0]; // Convertir le booléen en 1 ou 0 pour la requête SQL

    if (userEmail) {
      query += ` AND userEmail = ?`;
      values.push(userEmail);
    }
    return new Promise<SousCategorieDepense[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets SousCategorieDepense
          const sousCategories = results.map((row: any) => {
            return new SousCategorieDepense(
              row.IdSousCategorie,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nomSousCategorie,
              row.isPublic,
              row.validated,
              row.image,
              row.seuil,
              row.idCategorieDepense,
              row.userEmail,
              row.possedeFounisseur
            );
          });
          resolve(sousCategories);
        }
      });
    });
  }

  async update(
    id: number,
    nomSousCategorie: string,
    image: string,
    isPublic: boolean
  ): Promise<SousCategorieDepense> {
    console.log(isPublic);
    console.log(typeof isPublic);
    const isPublicInt = isPublic === true ? 1 : 0;
    console.log(isPublicInt);
    const query = `UPDATE sousCategoriesDepense SET nomSousCategorie = ?, image = ?, isPublic = ? WHERE IdSousCategorie = ?`;
    const values = [nomSousCategorie, image, isPublicInt, id];
    return new Promise<SousCategorieDepense>((resolve, reject) => {
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
    const query = ` UPDATE sousCategoriesDepense SET deleted = 1 WHERE IdSousCategorie = ?`;
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

  async findById(id: number): Promise<SousCategorieDepense | null> {
    const query = `SELECT * FROM sousCategoriesDepense WHERE IdSousCategorie = ?`;
    const values = [id];
    return new Promise<SousCategorieDepense | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Aucune sous-catégorie trouvée avec cet ID
          } else {
            const row = results[0];
            const sousCategorie = new SousCategorieDepense(
              row.IdSousCategorie,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nomSousCategorie,
              row.isPublic,
              row.validated,
              row.image,
              row.seuil,
              row.idCategorieDepense,
              row.userEmail,
              row.possedeFounisseur
            );

            resolve(sousCategorie);
          }
        }
      });
    });
  }
}
