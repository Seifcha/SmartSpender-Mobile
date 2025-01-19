import { User } from "../entities/User";

export interface IPasswordRepository {
  findByUsernameOrMail(identifier: string): Promise<User | null>;
  findUserById(userId: number): Promise<User | null>;
  updatePassword(userId: number, newPassword: string): Promise<void>;
  checkEmail(email: string): Promise<boolean>;
  saveResetCode(userId: number, resetCode: string): Promise<void>;
}
