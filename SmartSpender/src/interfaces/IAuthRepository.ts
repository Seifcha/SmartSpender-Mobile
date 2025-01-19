import { User } from "../entities/User";

export interface IAuthRepository {
  // saveRefreshToken(username: string, refreshToken: string): Promise<void>;
  findByEmail(user: string): Promise<User | null>;
}
