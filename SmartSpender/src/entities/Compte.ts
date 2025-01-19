export class Compte {
  constructor(
    public readonly idCompte: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly deleted: boolean,
    public readonly solde: number,
    public readonly iban: string,
    public readonly typeCompte: string,
    public readonly status: string,
    public readonly creditLign: number,
    public readonly nomCompte: string,
    public readonly userEmail: string,
    public readonly tauxInteret: number
  ) {}
}
