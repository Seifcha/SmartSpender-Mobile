export interface ITransfertInteractor {
  supprimerTransfert(transfertId: number);
  ajouterTransfert(input: any);
  checkMontant(
    montant: number,
    DeCompte: number,
    userEmail: string
  ): Promise<boolean>;
  getTransferts(userEmail: string);
  getTransfert(id: number);
}
