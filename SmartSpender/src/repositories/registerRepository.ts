//
import { injectable } from "inversify";
import { User } from "../entities/User";
import { IRegisterRepository } from "../interfaces/IRegisterRepository";
import { mysqlClient } from "../dbConnection";
import * as mysql from "mysql";
import Buffer from "buffer";
@injectable()
export class RegisterRepository implements IRegisterRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }
  ////////////
  async findByEmail(userEmail: string): Promise<User | null> {
    const query = `SELECT * FROM users where email = ?`;
    const values = [userEmail];
    return new Promise<User | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Aucune catégorie trouvée avec cet ID
          } else {
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
  async create({
    photoProfil,
    nom,
    prenom,
    genre,
    dateNaissance,
    adresse,
    phone,
    domaineTravail,
    posteTravail,
    email,
    hashedPwd,
  }: User): Promise<User> {
    console.log("gbal mysql");
    return new Promise<User>((resolve, reject) => {
      const query = `INSERT INTO users (photoProfil,nom, prenom, genre, dateNaissance, adresse, phone, domaineTravail, posteTravail, email, motDePasse) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? )`;
      const values = [
        photoProfil,
        nom,
        prenom,
        genre,
        dateNaissance,
        adresse,
        phone,
        domaineTravail,
        posteTravail,
        email,
        hashedPwd,
      ];

      // return new Promise<CmsUser>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          console.log("ba3d mysql");
          reject(error);
        } else {
          // Récupérer l'ID de l'utilisateur nouvellement inséré
          const id = results.insertId;

          // Créer une nouvelle instance de CmsUser avec les données insérées
          const newUser = new User(
            id,
            nom,
            prenom,
            dateNaissance,
            genre,
            hashedPwd,
            phone,
            adresse,
            email,
            photoProfil,
            domaineTravail,
            posteTravail,
            "",
            "",
            false,
            false,
            true
          );
          console.log("ba3d mysql");

          // Résoudre avec la nouvelle instance de CmsUser
          resolve(newUser);
        }
      });
    });
  }

  async getIdByEmail(email: string): Promise<number | null> {
    const query = `SELECT idUser FROM users WHERE email = ?`;
    const values = [email];

    return new Promise<number | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Aucun utilisateur trouvé avec cet email
          } else {
            resolve(results[0].idUser);
          }
        }
      });
    });
  }

  async update(
    nom: string,
    prenom: string,

    adresse: string,
    phone: string,
    domaineTravail: string,
    posteTravail: string,
    email: string,
    photoProfil: string
  ): Promise<User | null> {
    console.log("image: ", photoProfil);
    const query = `UPDATE users SET nom = ?, prenom = ?, adresse = ?, phone = ?, domaineTravail = ?, posteTravail = ?, photoProfil = ? WHERE email = ?`;
    const values = [
      nom,
      prenom,

      adresse,
      phone,
      domaineTravail,
      posteTravail,
      photoProfil,
      email,
    ];

    return new Promise<User | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.affectedRows === 0) {
            resolve(null); // Aucun utilisateur mis à jour
          } else {
            // Vous pouvez retourner l'utilisateur mis à jour en exécutant une requête SELECT
            resolve(results);
          }
        }
      });
    });
  }
}
//   async findImage(username: string): Promise<Buffer | null> {
//     const query = `SELECT photoProfil FROM cmsUsers WHERE username = ?`;
//     const values = [username];
//     return new Promise<Buffer | null>((resolve, reject) => {
//       this.connection.query(query, values, (error, results) => {
//         if (error) {
//           reject(error);
//         } else {
//           if (results.length === 0) {
//             resolve(null); // Aucune catégorie trouvée avec cet ID
//           } else {
//             const row = results[0];
//             const image = row.photoProfil;

//             resolve(image);
//           }
//         }
//       });
//     });
//   }

// username: string,
// password: string,
// prenom: string,
// nom: string,
// phone: string,
// email: string,
// profilePic: Buffer
// ): Promise<CmsUser> {
// // Créer un nouvel objet User avec les informations fournies
// const newUser = new CmsUser(
//   0, // L'ID sera généré automatiquement par la base de données
//   nom,
//   prenom,
//   username,
//   password,
//   phone,
//   email,
//   profilePic,
//   '',
//   '',
//   false,
//   false,
//   true,
//   ''
// );
// // Appel de la méthode create du repository pour enregistrer le nouvel utilisateur dans la base de données
