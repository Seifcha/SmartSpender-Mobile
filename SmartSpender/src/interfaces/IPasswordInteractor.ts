import { CmsUser } from "../entities/CmsUser";

export interface IPasswordInteractor {
  findUser(identifier: string);
  findUserById(userId: number);
  resetPassword(userId: number, newPassword: string);
  findOne(email: string);
  saveResetCode(idUser: number, resetCode: string);
}
