import { CategorieDepenseFournisseur } from "../entities/CategorieDepenseFournisseur";
import Buffer from "buffer";
export interface ICategorieDepenseFournisseurRepository {
  findAll(idCategorieDepense: number): Promise<CategorieDepenseFournisseur[]>;
}
