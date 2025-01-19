import { inject, injectable } from "inversify";
import { ICompteInteractor } from "../interfaces/ICompteInteractor";
import { ICompteRepository } from "../interfaces/ICompteRepository";
import { INTERFACE_TYPE } from "../utils";
import { Compte } from "../entities/Compte";

@injectable()
export class CompteInteractor implements ICompteInteractor {
  private repository: ICompteRepository;

  constructor(
    @inject(INTERFACE_TYPE.CompteRepository)
    repository: ICompteRepository
  ) {
    this.repository = repository;
  }

  async ajouterCompte(input: any) {
    const data = await this.repository.create(input);
    // faire des vérifications
    return data;
  }
  async getComptes(userEmail: string): Promise<Compte[]> {
    return await this.repository.findAll(userEmail);
  }
  async getComptesBancaires(
    userEmail: string,
    typeCarte: string
  ): Promise<Compte[]> {
    return await this.repository.findAllComptesBancaires(userEmail, typeCarte);
  }
  async getCompte(id: number): Promise<Compte | null> {
    return await this.repository.findById(id);
  }
  async modifierCompte(
    solde: number,
    status: string,
    creditLign: number,
    nomCompte: string,
    id: number
  ) {
    const data = await this.repository.update(
      solde,
      status,
      creditLign,
      nomCompte,
      id
    );
    return data;
  }

  async supprimerCompte(id: number): Promise<boolean> {
    const success = await this.repository.delete(id);
    // Faire des vérifications ou d'autres opérations
    return success;
  }

  async getCompteByType(
    typeCompte: string,
    userEmail: string
  ): Promise<Compte[]> {
    return await this.repository.findAllByType(typeCompte, userEmail);
  }
}
