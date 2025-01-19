export interface IDashboardRepository {
  getSommeMontants(
    userEmail: string
  ): Promise<{ date: string; cumulative_balance: number }[]>;
  getSommeDepense(
    userEmail: string
  ): Promise<
    { idCategorie: number; nomCategorie: string; sommeMontant: number }[]
  >;
  getSommeRevenu(
    userEmail: string
  ): Promise<
    { idCategorie: number; nomCategorie: string; sommeMontant: number }[]
  >;
  getFournisseurRevenuEtDepense(
    userEmail: string
  ): Promise<
    {
      idFournisseur: number;
      nom: string;
      sommeRevenu: number;
      sommeDepense: number;
    }[]
  >;
}
