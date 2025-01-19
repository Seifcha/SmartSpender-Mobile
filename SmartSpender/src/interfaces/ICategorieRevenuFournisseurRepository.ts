import { CategorieRevenuFournisseur } from "../entities/CategorieRevenuFournisseur";
import Buffer from "buffer";
export interface ICategorieRevenuFournisseurRepository {
  findAll(idCategorieRevenu: number): Promise<CategorieRevenuFournisseur[]>;
}
