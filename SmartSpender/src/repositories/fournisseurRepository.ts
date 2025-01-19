import { CategorieDepense } from "./../entities/CategorieDepense";
import { mysqlClient } from "../dbConnection";
import { Fournisseur } from "../entities/Fournisseur";
import { IFournisseurRepository } from "../interfaces/IFournisseurRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";

@injectable()
export class FournisseurRepository implements IFournisseurRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async create({
    userEmail,
    nom,
    mail,
    phone,
    isPublicInt,
    logo,
    idCategorieFournisseur,
  }: Fournisseur): Promise<Fournisseur> {
    return new Promise<Fournisseur>((resolve, reject) => {
      const query = `INSERT INTO fournisseurs (nom, logo, mail, phone, isPublic,idCategorieFournisseur, userEmail) VALUES (?,?,?,?, ?,?,?)`;

      // Convertir l'logo en un format approprié pour la base de données (par exemple, Buffer ou Uint8Array)

      const values = [
        nom,
        logo,
        mail,
        phone,
        isPublicInt,
        idCategorieFournisseur,
        userEmail,
      ];

      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Récupérer l'ID de la catégorie nouvellement insérée
          const fournisseurId = results.insertId;

          // Créer une nouvelle instance de Fournisseur avec les données insérées
          const newFournisseur = new Fournisseur(
            fournisseurId,
            idCategorieFournisseur,
            userEmail,
            new Date(), // Date de création actuelle
            new Date(), // Date de mise à jour actuelle
            false, // Aucune suppression
            null, // Date de suppression nulle
            nom,
            mail, // Supposons que la catégorie n'est pas publique par défaut
            phone, // Supposons que la catégorie n'est pas validée par défaut
            logo, // Utiliser le Buffer de l'logo
            isPublicInt,
            false
          );

          // Résoudre avec la nouvelle instance de Fournisseur
          resolve(newFournisseur);
        }
      });
    });
  }

  // async findAllByVisibility(
  //   isPublic: boolean,
  //   userEmail?: string
  // ): Promise<Fournisseur[]> {
  //   let query = `SELECT * FROM fournisseurs WHERE deleted = 0 AND isPublic = ?`;
  //   const values: any[] = [isPublic ? 1 : 0]; // Convertir le booléen en 1 ou 0 pour la requête SQL

  //   // Si userEmail est fourni et que les fournisseurs ne sont pas publics, ajoutez la clause userEmail à la requête
  //   if (!isPublic && userEmail) {
  //     query += ` AND userEmail = ?`;
  //     values.push(userEmail);
  //   }

  //   return new Promise<Fournisseur[]>((resolve, reject) => {
  //     this.connection.query(query, values, (error, results) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         // Mapper les résultats de la requête sur des objets Fournisseur
  //         const fournisseurs = results.map((row: any) => {
  //           return new Fournisseur(
  //             row.idFournisseur,
  //             row.idCategorieFournisseur,
  //             row.userEmail,
  //             row.createdAt,
  //             row.updatedAt,
  //             row.deleted,
  //             row.deletedAt,
  //             row.nom,
  //             row.mail,
  //             row.phone,
  //             row.logo,
  //             row.isPublic,
  //             row.valide
  //           );
  //         });
  //         resolve(fournisseurs);
  //       }
  //     });
  //   });
  // }

  // async findAll(userEmail: string, categorieDepense: number): Promise<Fournisseur[]> {
  //   try {
  //     // Exécuter d'abord la requête pour les fournisseurs publics
  //     const publicFournisseurs = await this.findAllByVisibility(true);
  //     // Ensuite, exécuter la requête pour les fournisseurs non publics
  //     const nonPublicFournisseurs = await this.findAllByVisibility(
  //       false,
  //       userEmail
  //     );

  //     // Combiner les résultats et les retourner
  //     return [...publicFournisseurs, ...nonPublicFournisseurs];
  //   } catch (error) {
  //     // Gérer les erreurs
  //     throw error;
  //   }
  // }
  async findAl(
    userEmail: string,
    categorieRevenu: number | string
  ): Promise<Fournisseur[]> {
    console.log("idCategorie associé", categorieRevenu);
    let query = `
    SELECT f.*
    FROM fournisseurs f
    JOIN categoriesRevenuFournisseur crf ON f.idCategorieFournisseur = crf.idCategorieFournisseur
    JOIN categoriesRevenu cr ON crf.idCategorieRevenu = cr.IdCategorie
    WHERE (cr.IdCategorie = ? AND f.valide = 1) OR (cr.IdCategorie = ? AND f.valide = 0 AND f.userEmail = ?)
    `;
    const values: any[] = [categorieRevenu, categorieRevenu, userEmail];
    return new Promise<Fournisseur[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets Fournisseur
          const fournisseurs = results.map((row: any) => {
            return new Fournisseur(
              row.idFournisseur,
              row.idCategorieFournisseur,
              row.userEmail,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nom,
              row.mail,
              row.phone,
              row.logo,
              row.isPublic,
              row.valide
            );
          });
          resolve(fournisseurs);
        }
      });
    });
  }

  async findAll(
    userEmail: string,
    categorieDepense: number | string
  ): Promise<Fournisseur[]> {
    console.log("idCategorie", categorieDepense);
    let query = `
    SELECT f.*
    FROM fournisseurs f
    JOIN categoriesDepenseFournisseur cdf ON f.idCategorieFournisseur = cdf.idCategorieFournisseur
    JOIN categoriesDepense cd ON cdf.idCategorieDepense = cd.IdCategorie
    WHERE (cd.IdCategorie = ? AND f.valide = 1 AND f.deleted = 0) OR (cd.IdCategorie = ? AND f.valide = 0 AND f.userEmail = ? AND f.deleted = 0)
    `;
    const values: any[] = [categorieDepense, categorieDepense, userEmail];
    return new Promise<Fournisseur[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets Fournisseur
          const fournisseurs = results.map((row: any) => {
            return new Fournisseur(
              row.idFournisseur,
              row.idCategorieFournisseur,
              row.userEmail,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nom,
              row.mail,
              row.phone,
              row.logo,
              row.isPublic,
              row.valide
            );
          });
          resolve(fournisseurs);
        }
      });
    });
  }

  async findAlll(userEmail: string): Promise<Fournisseur[]> {
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
  ): Promise<Fournisseur[]> {
    let query = `SELECT * FROM fournisseurs WHERE deleted = 0 AND valide = ?`;
    const values: any[] = [isValid ? 1 : 0];

    // Si userEmail est fourni, ajouter la clause userEmail à la requête
    if (userEmail) {
      query += ` AND userEmail = ?`;
      values.push(userEmail);
    }

    return new Promise<Fournisseur[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets CategorieDepense
          const categories = results.map((row: any) => {
            return new Fournisseur(
              row.idFournisseur,
              row.idCategorieFournisseur,
              row.userEmail,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nom,
              row.mail,
              row.phone,
              row.logo,
              row.isPublic,
              row.valide
            );
          });
          resolve(categories);
        }
      });
    });
  }

  async findById(idFournisseur: number): Promise<Fournisseur | null> {
    const query = `SELECT * FROM fournisseurs WHERE idFournisseur = ?`;
    const values = [idFournisseur];
    return new Promise<Fournisseur | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Aucune catégorie trouvée avec cet ID
          } else {
            const row = results[0];
            const fournisseur = new Fournisseur(
              row.idFournisseur,
              row.idCategorieFournisseur,
              row.userEmail,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.nom,
              row.mail,
              row.phone,
              row.logo,
              row.isPublic,
              row.valide
            );
            resolve(fournisseur);
          }
        }
      });
    });
  }

  async update(
    id: number,
    nom: string,
    logo: string,
    mail: string,
    phone: number,
    isPublicInt: number,
    idCategorieFournisseur
  ): Promise<Fournisseur> {
    const query = `UPDATE fournisseurs SET nom = ?, logo = ?, mail = ?, phone =?, isPublic=?, idCategorieFournisseur =? WHERE idFournisseur = ?`;
    const values = [
      nom,
      logo,
      mail,
      phone,
      idCategorieFournisseur,
      isPublicInt,
      id,
    ];
    return new Promise<Fournisseur>((resolve, reject) => {
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
    const query = `UPDATE fournisseurs SET deleted = 1 WHERE idFournisseur = ?`;
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
