import { inject, injectable } from "inversify";
import { ICarteInteractor } from "../interfaces/ICarteInteractor";
import { ICarteRepository } from "../interfaces/ICarteRepository";
import { INTERFACE_TYPE } from "../utils";
import { Carte } from "../entities/Carte";

@injectable()
export class CarteInteractor implements ICarteInteractor {
  private repository: ICarteRepository;

  constructor(
    @inject(INTERFACE_TYPE.CarteRepository)
    repository: ICarteRepository
  ) {
    this.repository = repository;
  }

  async ajouterCarte(input: any) {
    const data = await this.repository.create(input);
    // faire des vérifications
    return data;
  }
  async getCarte(id: number) {
    return await this.repository.findById(id);
  }
  async modifierCarte(id: number, dateExpiration: string) {
    const data = await this.repository.update(id, dateExpiration);
    return data;
  }

  async supprimerCarte(id: number): Promise<boolean> {
    const success = await this.repository.delete(id);
    // Faire des vérifications ou d'autres opérations
    return success;
  }

  async getCartes(userEmail: string): Promise<Carte[]> {
    return await this.repository.findAll(userEmail);
  }

  async getCartesByCompte(userEmail: string, idCompte): Promise<Carte[]> {
    return await this.repository.findAllByCompte(userEmail, idCompte);
  }
}
