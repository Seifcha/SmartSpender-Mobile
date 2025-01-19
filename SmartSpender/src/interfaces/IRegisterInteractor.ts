import { User } from "../entities/User";
export interface IRegisterInteractor {
  register(input: any);
  findByEmail(email: string): Promise<User | null>;
  modifierProfil(
    nom: string,
    prenom: string,

    adresse: string,
    phone: string,
    domaineTravail: string,
    posteTravail: string,
    email: string,
    photoProfil: string
  );
  getUser(userEmail: string);
}
//
