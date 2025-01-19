import { User } from "../entities/CmsUser";

export interface IAuthInteractor {
  authenticate(userEmail: string): Promise<User | null>;
  // saveToken(username: string, refreshToken: string): Promise<void>;
}
