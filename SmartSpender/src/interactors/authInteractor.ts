import { inject, injectable } from "inversify";

import { IAuthInteractor } from "../interfaces/IAuthInteractor";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { INTERFACE_TYPE } from "../utils";

import { User } from "../entities/User";

@injectable()
export class AuthInteractor implements IAuthInteractor {
  private repository: IAuthRepository;

  constructor(
    @inject(INTERFACE_TYPE.AuthRepository) repository: IAuthRepository
  ) {
    this.repository = repository;
  }

  async authenticate(userEmail: string): Promise<User | null> {
    return this.repository.findByEmail(userEmail);
  }

  //   async saveToken(username: string, refreshToken: string): Promise<void> {
  //     await this.repository.saveRefreshToken(username, refreshToken);
  //   }
}
