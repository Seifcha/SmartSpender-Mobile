export class CategorieDepenseFournisseur {
  constructor(
    public readonly idCategorieDepenseFournisseur: number,
    public readonly idCategorieDepense: number,
    public readonly idCategorieFournisseur: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date,
    public readonly deleted: boolean
  ) {}
}
