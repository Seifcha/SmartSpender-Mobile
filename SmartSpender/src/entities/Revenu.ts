export class Revenu {
  constructor(
    public readonly idRevenu: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deleted: boolean,
    public readonly deletedAt: Date,
    public readonly dateRevenu: Date,
    public readonly montant: number,
    public readonly categorieRevenu: number,
    public readonly fournisseur: number,
    public readonly description: string,
    public readonly userEmail: string,
    public readonly recurrente: boolean,
    public readonly recurrenceOption: string
  ) {}
}
