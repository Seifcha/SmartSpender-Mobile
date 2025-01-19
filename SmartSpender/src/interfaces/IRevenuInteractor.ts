export interface IRevenuInteractor {
  ajouterRevenu(input: any);
  ajouterTransactions(transactions: any[], idRevenu: number, userEmail: string);

  scheduleRecurrentTask(
    idRevenu: number,
    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateRevenu: string,
    categorieRevenu: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  );
  getRevenus(userEmail: string);
  deleteRevenu(revenuId: number);
  getRevenu(id: number);
}
