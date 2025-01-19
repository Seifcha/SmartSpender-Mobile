import { inject, injectable } from "inversify";
import { IPasswordInteractor } from "../interfaces/IPasswordInteractor";
import { IPasswordRepository } from "../interfaces/IPasswordRepository";
import { IMailer } from "../interfaces/IMailer";
import { INTERFACE_TYPE } from "../utils";
//////
@injectable()
export class PasswordInteractor implements IPasswordInteractor {
  private repository: IPasswordRepository;

  constructor(
    @inject(INTERFACE_TYPE.PasswordRepository)
    repository: IPasswordRepository
  ) {
    this.repository = repository;
  }

  async findUser(identifier: string) {
    // Logic to authenticate the user
    const user = await this.repository.findByUsernameOrMail(identifier);
    if (user) {
      console.log(user.id);
      return user; // Include user id in the returned object
    } else {
      return null; // Authentication failed
    }
  }
  async findUserById(userId: number) {
    // Logic to authenticate the user
    const user = await this.repository.findUserById(userId);
    if (user) {
      console.log(user.id);
      return user; // Include user id in the returned object
    } else {
      return null; // Authentication failed
    }
  }

  async resetPassword(userId: number, newPassword: string) {
    try {
      // Mettre à jour le mot de passe dans la couche de données
      const data = await this.repository.updatePassword(userId, newPassword);
      return data; // Réinitialisation du mot de passe réussie
    } catch (error) {
      throw new Error("Error resetting password");
    }
  }

  async findOne(email: string) {
    try {
      // Mettre à jour le mot de passe dans la couche de données
      const data = await this.repository.checkEmail(email);
      return data; // Réinitialisation du mot de passe réussie
    } catch (error) {
      throw new Error("Error sending mail");
    }
  }
  async saveResetCode(idUser: number, resetCode: string) {
    await this.repository.saveResetCode(idUser, resetCode);
  }
}
