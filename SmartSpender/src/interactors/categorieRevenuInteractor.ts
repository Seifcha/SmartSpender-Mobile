import { inject, injectable } from "inversify";
import { ICategorieRevenuInteractor } from "../interfaces/ICategorieRevenuInteractor";
import { ICategorieRevenuRepository } from "../interfaces/ICategorieRevenuRepository";
import { INTERFACE_TYPE } from "../utils";
// import { Buffer } from 'buffer';

@injectable()
export class CategorieRevenuInteractor implements ICategorieRevenuInteractor {
  private repository: ICategorieRevenuRepository;

  constructor(
    @inject(INTERFACE_TYPE.CategorieRevenuRepository)
    repository: ICategorieRevenuRepository
  ) {
    this.repository = repository;
  }
  //   definirSeuil(id: number, seuil: number) {
  //     throw new Error("Method not implemented.");
  //   }

  async getCategorieRevenus(userEmail: string) {
    return await this.repository.findAll(userEmail);
  }
  async getCategorieRevenu(id: number) {
    return await this.repository.findById(id);
  }

  async ajouterCategorieRevenu(input: any) {
    const data = await this.repository.create(input);
    // faire des vérifications
    return { insertedCategoryId: data.IdCategorie };
  }
  async ajouterCategoriesRevenuFournisseur(
    categoryId: number,
    categoriesFournisseur: number[]
  ) {
    return await this.repository.createCategoriesRevenuFournisseur(
      categoryId,
      categoriesFournisseur
    );
  }

  async modifierCategorieRevenu(
    id: number,
    nomCategorie: string,
    image: string,
    possedeFournisseurRevenu: number,
    idCategoriesFournisseurSelected: number[],
    isPublicInt: number
  ) {
    // Modifier la catégorie de dépense en premier
    await this.repository.modifierCategorieRevenu(
      id,
      nomCategorie,
      image,
      possedeFournisseurRevenu,
      isPublicInt
    );

    // En fonction de la valeur de possedeFournisseurRevenu
    if (possedeFournisseurRevenu === 0) {
      // Si possedeFournisseurRevenu est 0, supprimer toutes les associations
      await this.repository.supprimerToutesAssociations(id);
    } else {
      // Sinon, supprimer les associations non incluses et ajouter de nouvelles lignes
      await Promise.all([
        this.repository.supprimerAssociationsNonIncluses(
          id,
          idCategoriesFournisseurSelected
        ),
        this.repository.ajouterNouvellesLignesCategoriesRevenuFournisseur(
          id,
          idCategoriesFournisseurSelected
        ),
      ]);
    }
  }

  async supprimerCategorieRevenu(id: number): Promise<void> {
    await this.repository.supprimerCategorieRevenu(id);
  }
}
