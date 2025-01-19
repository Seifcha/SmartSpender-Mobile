export class Depense {
  constructor(
    public readonly idDepense: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deleted: boolean,
    public readonly deletedAt: Date,
    public readonly dateDepense: Date,
    public readonly montant: number,
    public readonly categorieDepense: number,
    public readonly sousCategorie: number,
    public readonly fournisseur: number,
    public readonly description: string,
    public readonly userEmail: string,
    public readonly recurrente: boolean,
    public readonly recurrenceOption: string
  ) {}
}
