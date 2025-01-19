export interface IDashboardInteractor {
  getSommeMontants(userEmail: string);
  getSommeDepense(userEmail: string);
  getSommeRevenu(userEmail: string);
  getFournisseurRevenuEtDepense(userEmail: string);
}
