import { injectable } from "inversify";
import * as mysql from "mysql";
import { mysqlClient } from "../dbConnection";
import { IPasswordRepository } from "../interfaces/IPasswordRepository";
import { User } from "../entities/User";

@injectable()
export class PasswordRepository implements IPasswordRepository {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysqlClient();
  }

  async findByUsernameOrMail(identifier: string): Promise<User | null> {
    const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    const values = [identifier];

    return new Promise<User | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
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
              userData.posteTravail,
              userData.domaineTravail,
              userData.resetCodePhone,
              userData.resetCodeMail,
              userData.isMailValidated,
              userData.isPhoneValidated,
              userData.actif
            );
            resolve(user);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  async findUserById(userId: number): Promise<User | null> {
    const query = `SELECT * FROM users WHERE idUser = ? LIMIT 1`;
    const values = [userId];

    return new Promise<User | null>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length > 0) {
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
              userData.posteTravail,
              userData.domaineTravail,
              userData.resetCodePhone,
              userData.resetCodeMail,
              userData.isMailValidated,
              userData.isPhoneValidated,
              userData.actif
            );
            resolve(user);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const query = `UPDATE users SET motDePasse = ? WHERE idUser = ?`;
    const values = [newPassword, userId];

    return new Promise<void>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async checkEmail(email: string): Promise<boolean> {
    const query = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
    const values = [email];

    return new Promise<boolean>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          const count = results[0].count;
          console.log(count);
          resolve(count > 0);
        }
      });
    });
  }

  async saveResetCode(userId: number, resetCode: string): Promise<void> {
    const query = `UPDATE users SET resetCodeMail = ? WHERE idUser = ?`;
    const values = [resetCode, userId];

    return new Promise<void>((resolve, reject) => {
      this.connection.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
