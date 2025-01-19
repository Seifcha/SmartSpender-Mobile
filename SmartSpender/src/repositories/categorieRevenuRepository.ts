import { mysqlClient } from "../dbConnection";
import { CategorieRevenu } from "../entities/CategorieRevenu";
// import { SousCategorieRevenu } from "../entities/SousCategorieRevenu";
// import { Buffer } from "buffer";
import { ICategorieRevenuRepository } from "../interfaces/ICategorieRevenuRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";

@injectable()
export class CategorieRevenuRepository implements ICategorieRevenuRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }
  //   validate(id: number): Promise<CategorieRevenu> {
  //     throw new Error("Method not implemented.");
  //   }

  async create({
    nomCategorie,
    image,
    possedeFournisseurRevenuInt,
    userEmail,
    isPublicInt,
  }: CategorieRevenu): Promise<CategorieRevenu> {
    return new Promise<CategorieRevenu>((resolve, reject) => {
      const query = `INSERT INTO categoriesRevenu (nomCategorie, image, possedeFournisseurRevenu, userEmail, isPublic, validated) VALUES (?, ?, ?, ?,?,0)`;

      // Convertir l'image en un format approprié pour la base de données (par exemple, Buffer ou Uint8Array)

      const values = [
        nomCategorie,
        image,
        possedeFournisseurRevenuInt,
        userEmail,
        isPublicInt,
      ];

      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Récupérer l'ID de la catégorie nouvellement insérée
          const categoryId = results.insertId;

          // Créer une nouvelle instance de CategorieRevenu avec les données insérées
          const newCategorieRevenu = new CategorieRevenu(
            categoryId,
            results.createdAt,
            results.updatedAt,
            results.deleted,
            results.deletedAt,
            results.nomCategorie,
            results.isPublicInt,
            results.validated,
            results.image,
            results.possedeFournisseurRevenuInt,
            results.userEmail
          );

          // Résoudre avec la nouvelle instance de CategorieRevenu
          resolve(newCategorieRevenu);
        }
      });
    });
  }
  async createCategoriesRevenuFournisseur(
    categoryId: number,
    categoriesFournisseur: number[]
  ) {
    const values = categoriesFournisseur.map((categorieId) => [
      categoryId,
      categorieId,
    ]);
    const query =
      "INSERT INTO categoriesRevenuFournisseur (IdCategorieRevenu, IdCategorieFournisseur) VALUES ?";
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

  async supprimerToutesAssociations(idCategorieRevenu: number) {
    return this.connection.query(
      `
      UPDATE categoriesRevenuFournisseur
      SET deleted = 1
      WHERE idCategorieRevenu = ?
      `,
      [idCategorieRevenu]
    );
  }

  async supprimerAssociationsNonIncluses(
    idCategorieRevenu: number,
    idCategoriesFournisseurSelected: number[]
  ) {
    return this.connection.query(
      `
      UPDATE categoriesRevenuFournisseur
      SET deleted = 1
      WHERE idCategorieRevenu = ?
      AND idCategorieFournisseur NOT IN (?)
      `,
      [idCategorieRevenu, idCategoriesFournisseurSelected]
    );
  }

  async modifierCategorieRevenu(
    id: number,
    nomCategorie: string,
    image: string,
    possedeFournisseurRevenu: number,
    isPublicInt: number
  ) {
    console.log(isPublicInt);
    return this.connection.query(
      `
      UPDATE categoriesRevenu
      SET nomCategorie = ?, image = ?, possedeFournisseurRevenu = ?, isPublic = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE IdCategorie = ? AND deleted = 0
      `,
      [nomCategorie, image, possedeFournisseurRevenu, isPublicInt, id]
    );
  }

  async ajouterNouvellesLignesCategoriesRevenuFournisseur(
    idCategorieRevenu: number,
    idCategoriesFournisseurSelected: number[]
  ) {
    await this.connection.query(
      `
      INSERT INTO categoriesRevenuFournisseur (idCategorieRevenu, idCategorieFournisseur)
SELECT ?, cf.IdCategorieFournisseur
FROM categoriesFournisseur cf
WHERE cf.IdCategorieFournisseur IN (?)
AND NOT EXISTS (
    SELECT 1
    FROM categoriesRevenuFournisseur cdf
    WHERE cdf.idCategorieFournisseur = cf.IdCategorieFournisseur
    AND cdf.idCategorieRevenu = ?
)
AND cf.deleted = 0

      `,
      [idCategorieRevenu, idCategoriesFournisseurSelected, idCategorieRevenu]
    );

    // Restaurer les associations supprimées avec deleted = 1
    await this.connection.query(
      `
      UPDATE categoriesRevenuFournisseur
      SET deleted = 0
      WHERE idCategorieRevenu = ?
      AND idCategorieFournisseur IN (?)   
      AND deleted = 1     
      `,
      [idCategorieRevenu, idCategoriesFournisseurSelected]
    );
  }

  async supprimerCategorieRevenu(id: number): Promise<void> {
    const query = `
      UPDATE categoriesRevenu
      SET deleted = 1
      WHERE IdCategorie = ?`;

    const values = [id];

    return new Promise<void>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Après avoir supprimé la catégorie de dépense, supprimez les associations dans la table categoriesRevenuFournisseur
          this.supprimerToutesAssociations(id)
            .then(() => resolve())
            .catch((err) => reject(err));
        }
      });
    });
  }

  async findAll(userEmail: string): Promise<CategorieRevenu[]> {
    try {
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
  ): Promise<CategorieRevenu[]> {
    let query = `SELECT * FROM categoriesRevenu WHERE deleted = 0 AND validated = ?`;
    const values: any[] = [isValid ? 1 : 0];

    if (userEmail) {
      query += ` AND userEmail = ?`;
      values.push(userEmail);
    }

    return new Promise<CategorieRevenu[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const categories = results.map((row: any) => {
            return new CategorieRevenu(
              row.IdCategorie,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nomCategorie,
              row.isPublic,
              row.validated, // Ensure this line is included
              row.image,
              row.possedeFournisseurRevenu,
              row.userEmail
            );
          });
          resolve(categories);
        }
      });
    });
  }

  async findById(id: number): Promise<CategorieRevenu | null> {
    const query = `SELECT * FROM categoriesRevenu WHERE IdCategorie = ?`;
    const values = [id];
    return new Promise<CategorieRevenu | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Aucune catégorie trouvée avec cet ID
          } else {
            const row = results[0];
            const categorie = new CategorieRevenu(
              row.IdCategorie,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nomCategorie,
              row.isPublic,
              row.valide,
              row.image,
              row.possedeFournisseurRevenu,
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
  // ): Promise<CategorieRevenu> {
  //   const query = `UPDATE categoriesRevenu SET nomCategorie = ?, image = ?, updatedAt = CURRENT_TIMESTAMP WHERE IdCategorie = ?`;
  //   const values = [nomCategorie, image, id];
  //   return new Promise<CategorieRevenu>((resolve, reject) => {
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
  // ): Promise<SousCategorieRevenu[]> {
  //   const query = `SELECT * FROM sousCategoriesRevenu WHERE idCategorieRevenu = ?`;
  //   const values = [id];
  //   return new Promise<SousCategorieRevenu[]>((resolve, reject) => {
  //     this.connection.query(query, values, (error, results) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         // Mapper les résultats de la requête sur des objets SousCategorieRevenu
  //         const sousCategories: SousCategorieRevenu[] = results.map(
  //           (row: any) => {
  //             return new SousCategorieRevenu(
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
  //               row.idCategorieRevenu
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
  //   const query = `  UPDATE sousCategoriesRevenu SET deleted = 1 , deletedAt = CURRENT_TIMESTAMP WHERE IdSousCategorie = ? ;
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
