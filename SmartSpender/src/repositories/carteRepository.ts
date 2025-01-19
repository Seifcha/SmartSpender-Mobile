import { mysqlClient } from "../dbConnection";
import { Carte } from "../entities/Carte";
import { ICarteRepository } from "../interfaces/ICarteRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";

@injectable()
export class CarteRepository implements ICarteRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async create({
    numCarte,
    typeCarte,
    dateExpiration,
    idCompte,
    userEmail,
  }: Carte): Promise<Carte> {
    return new Promise<Carte>((resolve, reject) => {
      const query = `INSERT INTO cartes (numeroCarte, typeCarte, dateExpiration, idCompte,userEmail) VALUES (?, ?, ?,?,?)`;

      // Convertir l'image en un format approprié pour la base de données (par exemple, Buffer ou Uint8Array)

      const values = [numCarte, typeCarte, dateExpiration, idCompte, userEmail];

      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Récupérer l'ID de la catégorie nouvellement insérée
          const carteId = results.insertId;

          // Créer une nouvelle instance de CategorieDepense avec les données insérées
          const newCarte = new Carte(
            carteId, // idCarte
            results.createdAt, // createdAt
            results.updatedAt, // updatedAt
            results.deletedAt, // deletedAt
            results.deleted, // deleted
            results.numeroCarte, // numeroCarte
            results.typeCarte, // typeCarte
            results.dateExpiration, // dateExpiration
            results.idCompte,
            results.userEmail
          );

          // Résoudre avec la nouvelle instance de CategorieDepense
          resolve(newCarte);
        }
      });
    });
  }

  async update(id: number, dateExpiration: string): Promise<Carte> {
    const query = `UPDATE cartes SET dateExpiration = ?  WHERE idCarte = ?`;
    const values = [dateExpiration, id];
    return new Promise<Carte>((resolve, reject) => {
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
    const query = ` UPDATE cartes SET deleted = 1 WHERE idCarte = ?`;
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

  async findAll(userEmail: string): Promise<Carte[]> {
    let query = `SELECT * FROM cartes WHERE deleted = 0 and userEmail=?`;
    const values: any[] = [userEmail];
    console.log(userEmail);
    console.log(typeof userEmail);
    return new Promise<Carte[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets Carte
          const cartes: Carte[] = results.map((row: any) => {
            return new Carte(
              row.idCarte,
              row.createdAt, // createdAt
              row.updatedAt, // updatedAt
              row.deletedAt, // deletedAt
              row.deleted, // deleted
              row.numeroCarte, // numeroCarte
              row.typeCarte, // typeCarte
              row.dateExpiration, // dateExpiration
              row.idCompte,
              row.userEmail
            );
          });
          resolve(cartes);
        }
      });
    });
  }

  async findById(id: number): Promise<Carte | null> {
    const query = `SELECT * FROM cartes WHERE idCarte = ?`;
    const values = [id];
    console.log("id:", id);
    console.log("type", typeof id);
    return new Promise<Carte | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Aucune sous-catégorie trouvée avec cet ID
          } else {
            const row = results[0];
            const carte = new Carte(
              row.idCarte,
              row.createdAt, // createdAt
              row.updatedAt, // updatedAt
              row.deletedAt, // deletedAt
              row.deleted, // deleted
              row.numeroCarte, // numeroCarte
              row.typeCarte, // typeCarte
              row.dateExpiration, // dateExpiration
              row.idCompte,
              row.userEmail
            );
            resolve(carte);
          }
        }
      });
    });
  }

  async findAllByCompte(userEmail: string, idCompte: string): Promise<Carte[]> {
    let query = `SELECT * FROM cartes WHERE deleted = 0 and userEmail=? and idCompte = ?`;
    const values: any[] = [userEmail, idCompte];
    return new Promise<Carte[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets Carte
          const cartes: Carte[] = results.map((row: any) => {
            return new Carte(
              row.idCarte,
              row.createdAt, // createdAt
              row.updatedAt, // updatedAt
              row.deletedAt, // deletedAt
              row.deleted, // deleted
              row.numeroCarte, // numeroCarte
              row.typeCarte, // typeCarte
              row.dateExpiration, // dateExpiration
              row.idCompte,
              row.userEmail
            );
          });
          resolve(cartes);
        }
      });
    });
  }
}
