import { Carte } from "../entities/Carte";

export interface ICarteRepository {
  create(carte: Carte): Promise<Carte>;
  update(id: number, dateExpiration: string): Promise<Carte>;
  delete(id: number): Promise<boolean>;
  findAll(userEmail: string): Promise<Carte[]>;
  findById(id: number): Promise<Carte | null>;
  findAllByCompte(userEmail: string, idCompte: string): Promise<Carte[]>;
}
