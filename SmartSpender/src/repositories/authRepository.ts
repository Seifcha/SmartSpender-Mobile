import { mysqlClient } from "../dbConnection";
import { User } from "../entities/User";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { injectable } from "inversify";
import * as mysql from "mysql";

@injectable()
export class AuthRepository implements IAuthRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }
  async findByEmail(userEmail: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = ? AND actif = 1`;
    const values = [userEmail];
    return new Promise<User | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          // Vérifier s'il y a des résultats
          if (results.length === 0) {
            resolve(null); // Aucun utilisateur trouvé avec ce nom d'utilisateur
          } else {
            // Extraire les données du premier résultat trouvé
            const userData = results[0];
            const user = new User(
              userData.idUser,
              userData.nom,
              userData.prenom,
              userData.dateNaissance,
              userData.genre,
              userData.motDePasse,
              userData.phone,
              userData.adresse,
              userData.email,
              userData.photoProfil,
              userData.domaineTravail,
              userData.posteTravail,
              userData.resetCodePhone,
              userData.resetCodeMail,
              userData.isMailValidated,
              userData.isPhoneValidated,
              userData.actif
            );
            resolve(user);
          }
        }
      });
    });
  }

  // } else {
  //   // Récupérer l'ID de la catégorie nouvellement insérée
  //   const categoryId = results.insertId;

  //   // Créer une nouvelle instance de CategorieDepense avec les données insérées
  //   const newCategorieDepense = new CategorieDepense(
  //       categoryId,
  //       new Date(), // Date de création actuelle
  //       new Date(), // Date de mise à jour actuelle
  //       false, // Aucune suppression
  //       new Date(), // Date de suppression nulle
  //       nomCategorie,
  //       false, // Supposons que la catégorie n'est pas publique par défaut
  //       false, // Supposons que la catégorie n'est pas validée par défaut
  //       image, // Utiliser le Buffer de l'image
  //       possedeFournisseurDepenseInt,
  //       0 // Seuil initial à 0
  //   );

  //   // Résoudre avec la nouvelle instance de CategorieDepense
  //   resolve(newCategorieDepense);
  // }
  //   async saveRefreshToken(
  //     username: string,
  //     refreshToken: string
  //   ): Promise<void> {
  //     const query = `UPDATE cmsUsers SET refreshToken = ? WHERE username = ?`;
  //     const values = [refreshToken, username];
  //     return new Promise<void>((resolve, reject) => {
  //       this.connection.query(query, values, (error, results) => {
  //         if (error) {
  //           reject(error);
  //         } else {
  //           resolve(results);
  //         }
  //       });
  //     });
  //   }
}
