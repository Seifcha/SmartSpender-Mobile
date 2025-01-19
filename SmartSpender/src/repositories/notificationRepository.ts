import { mysqlClient } from "../dbConnection";
import { Notification } from "../entities/Notification";
import { INotificationRepository } from "../interfaces/INotificationRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";

@injectable()
export class NotificationRepository implements INotificationRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async findAll(userEmail: string): Promise<Notification[]> {
    console.log("userEmail", userEmail);
    let query = `SELECT * FROM notifications WHERE deleted = 0 and userEmail=?`;
    const values: any[] = [userEmail];

    return new Promise<Notification[]>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Mapper les résultats de la requête sur des objets Notification
          const notifications: Notification[] = results.map((row: any) => {
            return new Notification(
              row.IdNotification,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.userEmail,
              row.titre,
              row.contenu,
              row.image,
              row.nomFournisseur,
              row.vu,
              row.idDepense,
              row.idRevenu,
              row.type
            );
          });
          resolve(notifications);
        }
      });
    });
  }

  async findById(id: number): Promise<Notification | null> {
    const query = `SELECT * FROM notifications WHERE IdNotification = ?`;
    const values = [id];
    return new Promise<Notification | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Aucune notification trouvée avec cet ID
          } else {
            const row = results[0];
            const notification = new Notification(
              row.idNotification,
              row.createdAt,
              row.updatedAt,
              row.deleted,
              row.deletedAt,
              row.userEmail,
              row.titre,
              row.contenu,
              row.image,
              row.nomFournisseur,
              row.vu,
              row.idDepense,
              row.idRevenu,
              row.type
            );
            resolve(notification);
          }
        }
      });
    });
  }

  async updateVu(id: number): Promise<Notification> {
    const query = `UPDATE notifications SET vu = 0 WHERE  IdNotification = ?`;
    const values = [id];
    return new Promise<Notification>((resolve, reject) => {
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

// Méthode pour récupérer toutes les sous-catégories associées à une catégorie de dépenses
// async getSousCategoriesByCategorieId(
//   id: number
// ): Promise<SousNotification[]> {
//   const query = `SELECT * FROM sousCategoriesDepense WHERE idNotification = ?`;
//   const values = [id];
//   return new Promise<SousNotification[]>((resolve, reject) => {
//     this.connection.query(query, values, (error, results) => {
//       if (error) {
//         reject(error);
//       } else {
//         // Mapper les résultats de la requête sur des objets SousNotification
//         const sousCategories: SousNotification[] = results.map(
//           (row: any) => {
//             return new SousNotification(
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
//               row.idNotification
//             );
//           }
//         );
//         resolve(sousCategories);
//       }
//     });
//   });
// }

//   async modifierNotification(
//     id: number,
//     nomCategorie: string,
//     image: string,
//     possedeFournisseurDepense: number,
//     isPublicInt: number
//   ) {
//     console.log(isPublicInt);
//     return this.connection.query(
//       `
//       UPDATE categoriesDepense
//       SET nomCategorie = ?, image = ?, possedeFournisseurDepense = ?, isPublic = ?, updatedAt = CURRENT_TIMESTAMP
//       WHERE IdCategorie = ? AND deleted = 0
//       `,
//       [nomCategorie, image, possedeFournisseurDepense, isPublicInt, id]
//     );
//   }
