import { User } from "./../entities/User";
import { inject, injectable } from "inversify";
import { ISeuilInteractor } from "../interfaces/ISeuilInteractor";
import { ISeuilRepository } from "../interfaces/ISeuilRepository";

import { ICategorieDepenseRepository } from "../interfaces/ICategorieDepenseRepository";
import { INTERFACE_TYPE } from "../utils";
import { Seuil } from "../entities/Seuil";
import { addMonths, addYears } from "date-fns";
@injectable()
export class SeuilInteractor implements ISeuilInteractor {
  private repository: ISeuilRepository;
  //   private categorieDepenseRepository: ICategorieDepenseRepository; // Ajout de l'attribut pour le repository de catégorie de dépense

  constructor(
    @inject(INTERFACE_TYPE.SeuilRepository)
    repository: ISeuilRepository
    // @inject(INTERFACE_TYPE.CategorieDepenseRepository)
    // categorieDepenseRepository: ICategorieDepenseRepository
  ) {
    this.repository = repository;
    // this.categorieDepenseRepository = categorieDepenseRepository; // Initialisation de l'attribut
  }
  //   definirSeuil(id: number, seuil: number): Promise<Seuil> {
  //     throw new Error("Method not implemented.");
  //   }

  async ajouterSeuil(input: any) {
    const { periode } = input;
    const currentDate = new Date();
    let dateFin: Date;
    console.log(periode);
    switch (periode) {
      case "mois":
        dateFin = addMonths(currentDate, 1);
        break;
      case "3mois":
        dateFin = addMonths(currentDate, 3);
        break;
      case "6mois":
        dateFin = addMonths(currentDate, 6);
        break;
      case "an":
        dateFin = addYears(currentDate, 1);
        break;
      default:
        throw new Error("Période invalide");
    }

    input.dateFin = dateFin;

    const data = await this.repository.create(input);
    return data;
  }
  async getSeuils(userEmail: string): Promise<Seuil[]> {
    return await this.repository.findAll(userEmail);
  }
  async getSeuil(id: number): Promise<Seuil | null> {
    return await this.repository.findById(id);
  }
  async getSeuilByCategorieDepense(
    categorieDepense: number,
    userEmail: string
  ): Promise<number[]> {
    return await this.repository.getDifferencesForCategory(
      categorieDepense,
      userEmail
    );
  }
  async getSeuilBySousCategorieDepense(
    sousCategorie: number,
    userEmail: string
  ): Promise<number[]> {
    console.log(sousCategorie, userEmail);
    return await this.repository.getDifferencesForSubCategory(
      sousCategorie,
      userEmail
    );
  }
  async modifierSeuil(id: number, montant: number, periode: string) {
    const data = await this.repository.update(id, montant, periode);
    return data;
  }
  //   async getNomCategorieDepenseByID(
  //     idCategorieDepense: number
  //   ): Promise<string> {
  //     const categorieDepense = await this.categorieDepenseRepository.findById(
  //       idCategorieDepense
  //     );
  //     if (categorieDepense) {
  //       return categorieDepense.nomCategorie;
  //     } else {
  //       throw new Error("Catégorie de dépense parente non trouvée.");
  //     }
  //   }
  async supprimerSeuil(id: number): Promise<boolean> {
    const success = await this.repository.delete(id);
    // Faire des vérifications ou d'autres opérations
    return success;
  }
}
