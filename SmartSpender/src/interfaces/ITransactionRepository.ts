export interface ITransactionRepository {
  findAll(id: number): Promise<
    {
      moyen: string;
      nomCompte: string;
      nomCarte: string;
      amount: number;
    }[]
  >;
  findAllRevenu(id: number): Promise<
    {
      moyen: string;
      nomCompte: string;
      amount: number;
    }[]
  >;
}
