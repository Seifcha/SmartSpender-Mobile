//
import { inject, injectable } from "inversify";
import { IRegisterRepository } from "../interfaces/IRegisterRepository";
import { User } from "../entities/User";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class RegisterInteractor {
  private repository: IRegisterRepository;

  constructor(
    @inject(INTERFACE_TYPE.RegisterRepository) repository: IRegisterRepository
  ) {
    this.repository = repository;
  }

  async findByEmail(email: string): Promise<User | null> {
    // Appel de la méthode findByUsername du repository pour trouver l'utilisateur par son nom d'utilisateur
    const user = await this.repository.findByEmail(email);
    // Retourner l'utilisateur trouvé ou null s'il n'existe pas
    return user;
  }

  async register(input: any) {
    const savedUser = await this.repository.create(input);
    // faire des vérifications
    return savedUser;
  }
  async modifierProfil(
    nom: string,
    prenom: string,
    adresse: string,
    phone: string,
    domaineTravail: string,
    posteTravail: string,
    email: string,
    photoProfil: string
  ) {
    const data = await this.repository.update(
      nom,
      prenom,
      adresse,
      phone,
      domaineTravail,
      posteTravail,
      email,
      photoProfil
    );
    return data;
  }
  //   async getImage(username: string) {
  //     const image = await this.repository.findImage(username);
  //     return image;
  //   }
  async getUser(userEmail: string) {
    return await this.repository.findByEmail(userEmail);
  }
}
