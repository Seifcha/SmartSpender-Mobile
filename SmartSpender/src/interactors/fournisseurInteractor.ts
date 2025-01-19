import { inject, injectable } from "inversify";
import { IFournisseurInteractor } from "../interfaces/IFournisseurInteractor";
import { IFournisseurRepository } from "../interfaces/IFournisseurRepository";
import { INTERFACE_TYPE } from "../utils";
import { Fournisseur } from "../entities/Fournisseur";

@injectable()
export class FournisseurInteractor implements IFournisseurInteractor {
  private repository: IFournisseurRepository;

  constructor(
    @inject(INTERFACE_TYPE.FournisseurRepository)
    repository: IFournisseurRepository
  ) {
    this.repository = repository;
  }
  async getFournisseurs(userEmail: string, categorieDepense: number | string) {
    return await this.repository.findAll(userEmail, categorieDepense);
  }
  async getFournisseursss(userEmail: string, categorieRevenu: number | string) {
    console.log("CRA", categorieRevenu);

    return await this.repository.findAl(userEmail, categorieRevenu);
  }

  async getFournisseurss(userEmail: string) {
    return await this.repository.findAlll(userEmail);
  }
  async getFournisseur(IdFournisseur: number) {
    return await this.repository.findById(IdFournisseur);
  }

  async ajouterFournisseur(input: any) {
    const data = await this.repository.create(input);
    // faire des vérifications
    return data;
  }

  async modifierFournisseur(
    id: number,
    nom: string,
    logo: string,
    mail: string,
    phone: number,
    isPublicInt: number,
    idCategorieFournisseur: number
  ) {
    const data = await this.repository.update(
      id,
      nom,
      logo,
      mail,
      phone,
      isPublicInt,
      idCategorieFournisseur
    );
    return data;
  }

  async supprimerFournisseur(IdFournisseur: number) {
    const success = await this.repository.delete(IdFournisseur);
    // faire des vérifications ou d'autres opérations
    return success;
  }
}
