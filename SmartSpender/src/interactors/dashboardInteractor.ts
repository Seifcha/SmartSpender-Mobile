import { inject, injectable } from "inversify";
import { IDashboardInteractor } from "../interfaces/IDashboardInteractor";
import { IDashboardRepository } from "../interfaces/IDashboardRepository";
import { INTERFACE_TYPE } from "../utils";
// import { Buffer } from 'buffer';

@injectable()
export class DashboardInteractor implements IDashboardInteractor {
  private repository: IDashboardRepository;

  constructor(
    @inject(INTERFACE_TYPE.DashboardRepository)
    repository: IDashboardRepository
  ) {
    this.repository = repository;
  }

  async getSommeMontants(userEmail: string) {
    return await this.repository.getSommeMontants(userEmail);
  }
  async getSommeDepense(userEmail: string) {
    return await this.repository.getSommeDepense(userEmail);
  }
  async getSommeRevenu(userEmail: string) {
    return await this.repository.getSommeRevenu(userEmail);
  }

  async getFournisseurRevenuEtDepense(userEmail: string) {
    return await this.repository.getFournisseurRevenuEtDepense(userEmail);
  }
}
