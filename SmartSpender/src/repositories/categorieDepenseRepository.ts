import { mysqlClient } from "../dbConnection";
import { CategorieDepense } from "../entities/CategorieDepense";
// import { SousCategorieDepense } from "../entities/SousCategorieDepense";
// import { Buffer } from "buffer";
import { ICategorieDepenseRepository } from "../interfaces/ICategorieDepenseRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";

@injectable()
export class CategorieDepenseRepository implements ICategorieDepenseRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }
  //   validate(id: number): Promise<CategorieDepense> {
  //     throw new Error("Method not implemented.");
  //   }

  async create({
    nomCategorie,
    image,
    possedeFournisseurDepenseInt,
    userEmail,
    isPublicInt,
  }: CategorieDepense): Promise<CategorieDepense> {
    return new Promise<CategorieDepense>((resolve, reject) => {
      const query = `INSERT INTO categoriesDepense (nomCategorie, image, possedeFournisseurDepense, userEmail, isPublic, valide) VALUES (?, ?, ?, ?,?,0)`;

      // Convertir l'image en un format approprié pour la base de données (par exemple, Buffer ou Uint8Array)

      const values = [
        nomCategorie,
        image,
        possedeFournisseurDepenseInt,
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
          const newCategorieDepense = new CategorieDepense(
            categoryId,
            results.createdAt,
            results.updatedAt,
            results.deleted,
            results.deletedAt,
            results.nomCategorie,
            results.isPublicInt,
            results.validated,
            results.image,
            results.possedeFournisseurDepenseInt,
            results.Seuil,
            results.userEmail
          );

          // Résoudre avec la nouvelle instance de CategorieDepense
          resolve(newCategorieDepense);
        }
      });
    });
  }
  async createCategoriesDepenseFournisseur(
    categoryId: number,
    categoriesFournisseur: number[]
  ) {
    const values = categoriesFournisseur.map((categorieId) => [
      categoryId,
      categorieId,
    ]);
    const query =
      "INSERT INTO categoriesDepenseFournisseur (IdCategorieDepense, IdCategorieFournisseur) VALUES ?";
    return new Promise((resolve, reject) => {
      this.connection.query(query, [values], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  async supprimerToutesAssociations(idCategorieDepense: number) {
    return this.connection.query(
      `
      UPDATE categoriesDepenseFournisseur
      SET deleted = 1
      WHERE idCategorieDepense = ?
      `,
      [idCategorieDepense]
    );
  }

  async supprimerAssociationsNonIncluses(
    idCategorieDepense: number,
    idCategoriesFournisseurSelected: number[]
  ) {
    return this.connection.query(
      `
      UPDATE categoriesDepenseFournisseur
      SET deleted = 1
      WHERE idCategorieDepense = ?
      AND idCategorieFournisseur NOT IN (?)
      `,
      [idCategorieDepense, idCategoriesFournisseurSelected]
    );
  }

  async modifierCategorieDepense(
    id: number,
    nomCategorie: string,
    image: string,
    possedeFournisseurDepense: number,
    isPublicInt: number
  ) {
    console.log(isPublicInt);
    return this.connection.query(
      `
      UPDATE categoriesDepense
      SET nomCategorie = ?, image = ?, possedeFournisseurDepense = ?, isPublic = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE IdCategorie = ? AND deleted = 0
      `,
      [nomCategorie, image, possedeFournisseurDepense, isPublicInt, id]
    );
  }

  async ajouterNouvellesLignesCategoriesDepenseFournisseur(
    idCategorieDepense: number,
    idCategoriesFournisseurSelected: number[]
  ) {
    await this.connection.query(
      `
      INSERT INTO categoriesDepenseFournisseur (idCategorieDepense, idCategorieFournisseur)
SELECT ?, cf.IdCategorieFournisseur
FROM categoriesFournisseur cf
WHERE cf.IdCategorieFournisseur IN (?)
AND NOT EXISTS (
    SELECT 1
    FROM categoriesDepenseFournisseur cdf
    WHERE cdf.idCategorieFournisseur = cf.IdCategorieFournisseur
    AND cdf.idCategorieDepense = ?
)
AND cf.deleted = 0

      `,
      [idCategorieDepense, idCategoriesFournisseurSelected, idCategorieDepense]
    );

    // Restaurer les associations supprimées avec deleted = 1
    await this.connection.query(
      `
      UPDATE categoriesDepenseFournisseur
      SET deleted = 0
      WHERE idCategorieDepense = ?
      AND idCategorieFournisseur IN (?)   
      AND deleted = 1     
      `,
      [idCategorieDepense, idCategoriesFournisseurSelected]
    );
  }

  async supprimerCategorieDepense(id: number): Promise<void> {
    const query = `
      UPDATE categoriesDepense
      SET deleted = 1
      WHERE IdCategorie = ?`;

    const values = [id];

    return new Promise<void>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Après avoir supprimé la catégorie de dépense, supprimez les associations dans la table categoriesDepenseFournisseur
          this.supprimerToutesAssociations(id)
            .then(() => resolve())
            .catch((err) => reject(err));
        }
      });
    });
  }

  async findAll(userEmail: string): Promise<CategorieDepense[]> {
    try {
      console.log(userEmail);
      // Exécuter d'abord la requête pour les catégories de dépenses publiques valides
      const publicCategories = await this.findAllByVisibility(true);
      // Ensuite, exécuter la requête pour les catégories de dépenses non publiques valides avec l'email de l'utilisateur
      const nonPublicCategories = await this.findAllByVisibility(
        false,
        userEmail
      );

      // Combiner les résultats et les retourner
      return [...publicCategories, ...nonPublicCategories];
    } catch (error) {
      // Gérer les erreurs
      throw error;
    }
  }

  async findAllByVisibility(
    isValid: boolean,
    userEmail?: string
  ): Promise<CategorieDepense[]> {
    let query = `SELECT * FROM categoriesDepense WHERE deleted = 0 AND valide = ?`;
    const values: any[] = [isValid ? 1 : 0];

    // Si userEmail est fourni, ajouter la clause userEmail à la requête
    if (userEmail) {
      query += ` AND userEmail = ?`;
      values.push(userEmail);
    }

    return new Promise<CategorieDepense[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets CategorieDepense
          const categories = results.map((row: any) => {
            return new CategorieDepense(
              row.IdCategorie,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nomCategorie,
              row.isPublic,
              row.valide,
              row.image,
              row.possedeFournisseurDepense,
              row.Seuil,
              row.userEmail
            );
          });
          resolve(categories);
        }
      });
    });
  }

  async findById(id: number): Promise<CategorieDepense | null> {
    const query = `SELECT * FROM categoriesDepense WHERE IdCategorie = ?`;
    const values = [id];
    return new Promise<CategorieDepense | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Aucune catégorie trouvée avec cet ID
          } else {
            const row = results[0];
            const categorie = new CategorieDepense(
              row.IdCategorie,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nomCategorie,
              row.isPublic,
              row.valide,
              row.image,
              row.possedeFournisseurDepense,
              row.Seuil,
              row.userEmail
            );
            resolve(categorie);
          }
        }
      });
    });
  }

  // async update(
  //   id: number,
  //   nomCategorie: string,
  //   image: string
  // ): Promise<CategorieDepense> {
  //   const query = `UPDATE categoriesDepense SET nomCategorie = ?, image = ?, updatedAt = CURRENT_TIMESTAMP WHERE IdCategorie = ?`;
  //   const values = [nomCategorie, image, id];
  //   return new Promise<CategorieDepense>((resolve, reject) => {
  //     this.connection.query(query, values, (error, results) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         resolve(results);
  //       }
  //     });
  //   });
  // }

  // Méthode pour récupérer toutes les sous-catégories associées à une catégorie de dépenses
  // async getSousCategoriesByCategorieId(
  //   id: number
  // ): Promise<SousCategorieDepense[]> {
  //   const query = `SELECT * FROM sousCategoriesDepense WHERE idCategorieDepense = ?`;
  //   const values = [id];
  //   return new Promise<SousCategorieDepense[]>((resolve, reject) => {
  //     this.connection.query(query, values, (error, results) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         // Mapper les résultats de la requête sur des objets SousCategorieDepense
  //         const sousCategories: SousCategorieDepense[] = results.map(
  //           (row: any) => {
  //             return new SousCategorieDepense(
  //               row.IdSousCategorie,
  //               row.createdAt,
  //               row.updatedAt,
  //               row.deleted,
  //               row.deletedAt,
  //               row.nomSousCategorie,
  //               row.isPublic,
  //               row.validated,
  //               row.image,
  //               row.seuil,
  //               row.idCategorieDepense
  //             );
  //           }
  //         );
  //         resolve(sousCategories);
  //       }
  //     });
  //   });
  // }

  // // Méthode pour supprimer une sous-catégorie par son ID
  // async deleteSubCategory(id: number): Promise<boolean> {
  //   const query = `  UPDATE sousCategoriesDepense SET deleted = 1 , deletedAt = CURRENT_TIMESTAMP WHERE IdSousCategorie = ? ;
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
}
