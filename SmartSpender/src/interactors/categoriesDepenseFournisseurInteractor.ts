import { inject, injectable } from "inversify";
import { ICategorieDepenseFournisseurInteractor } from "../interfaces/ICategorieDepenseFournisseurInteractor";
import { ICategorieDepenseFournisseurRepository } from "../interfaces/ICategorieDepenseFournisseurRepository";
import { INTERFACE_TYPE } from "../utils";
// import { Buffer } from 'buffer';

@injectable()
export class CategorieDepenseFournisseurInteractor
  implements ICategorieDepenseFournisseurInteractor
{
  private repository: ICategorieDepenseFournisseurRepository;

  constructor(
    @inject(INTERFACE_TYPE.CategorieDepenseFournisseurRepository)
    repository: ICategorieDepenseFournisseurRepository
  ) {
    this.repository = repository;
  }

  async getCategoriesDepenseFournisseur(idCategorieDepense: number) {
    return await this.repository.findAll(idCategorieDepense);
  }
}
