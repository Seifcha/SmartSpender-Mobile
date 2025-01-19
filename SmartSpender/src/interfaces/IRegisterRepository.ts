import { User } from "../entities/User";

export interface IRegisterRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(
    nom: string,
    prenom: string,

    adresse: string,
    phone: string,
    domaineTravail: string,
    posteTravail: string,
    email: string,
    photoProfil: string
  ): Promise<User | null>;
  getIdByEmail(email: string): Promise<number | null>;
  // findImage(username: string): Promise<Buffer | null>;
}
