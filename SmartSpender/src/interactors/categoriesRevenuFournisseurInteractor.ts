import { inject, injectable } from "inversify";
import { ICategorieRevenuFournisseurInteractor } from "../interfaces/ICategorieRevenuFournisseurInteractor";
import { ICategorieRevenuFournisseurRepository } from "../interfaces/ICategorieRevenuFournisseurRepository";
import { INTERFACE_TYPE } from "../utils";
// import { Buffer } from 'buffer';

@injectable()
export class CategorieRevenuFournisseurInteractor
  implements ICategorieRevenuFournisseurInteractor
{
  private repository: ICategorieRevenuFournisseurRepository;

  constructor(
    @inject(INTERFACE_TYPE.CategorieRevenuFournisseurRepository)
    repository: ICategorieRevenuFournisseurRepository
  ) {
    this.repository = repository;
  }

  async getCategoriesRevenuFournisseur(idCategorieRevenu: number) {
    return await this.repository.findAll(idCategorieRevenu);
  }
}
