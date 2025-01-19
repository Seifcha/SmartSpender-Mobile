export interface IDepenseInteractor {
  checkMontant(transactions: any[], userEmail: string);
  ajouterDepense(input: any);
  ajouterTransactions(
    transactions: any[],
    idDepense: number,
    userEmail: string
  );
  ajouterSeuilCategorie(
    categorieDepense: number,
    userEmail: string,
    montant: number
  );
  ajouterSeuilSousCategorie(
    sousCategorie: number,
    userEmail: string,
    montant: number
  );
  scheduleRecurrentTask(
    idDepense: number,
    recurrente: boolean,
    recurrenceOption: string,
    description: string,
    dateDepense: string,
    categorieDepense: number,
    sousCategorie: number,
    fournisseur: number,
    montant: number,
    transactions: any[],
    userEmail: string
  );
  getDepense(id: number);
  getDepenses(userEmail: string);
  deleteDepense(depenseId: number);
}
