import { inject, injectable } from "inversify";
import { ISousCategorieDepenseInteractor } from "../interfaces/ISousCategorieDepenseInteractor";
import { ISousCategorieDepenseRepository } from "../interfaces/ISousCategorieDepenseRepository";
import { ICategorieDepenseRepository } from "../interfaces/ICategorieDepenseRepository";
import { INTERFACE_TYPE } from "../utils";
import { SousCategorieDepense } from "../entities/SousCategorieDepense";

@injectable()
export class SousCategorieDepenseInteractor
  implements ISousCategorieDepenseInteractor
{
  private repository: ISousCategorieDepenseRepository;
  private categorieDepenseRepository: ICategorieDepenseRepository; // Ajout de l'attribut pour le repository de catégorie de dépense

  constructor(
    @inject(INTERFACE_TYPE.SousCategorieDepenseRepository)
    repository: ISousCategorieDepenseRepository,
    @inject(INTERFACE_TYPE.CategorieDepenseRepository)
    categorieDepenseRepository: ICategorieDepenseRepository
  ) {
    this.repository = repository;
    this.categorieDepenseRepository = categorieDepenseRepository; // Initialisation de l'attribut
  }
  //   definirSeuil(id: number, seuil: number): Promise<SousCategorieDepense> {
  //     throw new Error("Method not implemented.");
  //   }

  //   async getNomCategorieDepenseByID(
  //     idCategorieDepense: number
  //   ): Promise<string> {
  //     const categorieDepense = await this.categorieDepenseRepository.findById(
  //
  //     );
  //     if (categorieDepense) {
  //       return categorieDepense.nomCategorie;
  //     } else {
  //       throw new Error("Catégorie de dépense parente non trouvée.");
  //     }
  //   }

  async ajouterSousCategorieDepense(input: any) {
    const data = await this.repository.create(input);
    // faire des vérifications
    return data;
  }

  async modifierSousCategorieDepense(
    id: number,
    nomSousCategorie: string,
    image: string,
    isPublic: boolean
  ) {
    const data = await this.repository.update(
      id,
      nomSousCategorie,
      image,
      isPublic
    );
    return data;
  }

  async supprimerSousCategorieDepense(id: number): Promise<boolean> {
    const success = await this.repository.delete(id);
    // Faire des vérifications ou d'autres opérations
    return success;
  }

  async getSousCategoriesDepenses(
    userEmail: string,
    idCategorieParente: number
  ): Promise<SousCategorieDepense[]> {
    return await this.repository.findAll(userEmail, idCategorieParente);
  }
  async getSousCategorie(id: number): Promise<SousCategorieDepense | null> {
    return await this.repository.findById(id);
  }
}
