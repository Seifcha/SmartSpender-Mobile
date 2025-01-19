import { CategorieFournisseur } from "../entities/CategorieFournisseur";

export interface ICategorieFournisseurRepository {
  findAll(
    limit: number | undefined,
    offset: number
  ): Promise<CategorieFournisseur[]>;
  findById(id: number): Promise<CategorieFournisseur | null>;
}
