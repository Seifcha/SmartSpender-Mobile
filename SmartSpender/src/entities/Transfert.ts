export class Transfert {
  constructor(
    public readonly idTransfert: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deleted: boolean,
    public readonly deletedAt: Date,
    public readonly dateTransfert: Date,
    public readonly montant: number,
    public readonly description: string,
    public readonly DeCompte: number,
    public readonly VersCompte: number,
    public readonly userEmail: string
  ) {}
}
