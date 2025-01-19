export class CategorieRevenuFournisseur {
  constructor(
    public readonly idCategorieRevenuFournisseur: number,
    public readonly idCategorieRevenu: number,
    public readonly idCategorieFournisseur: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date,
    public readonly deleted: boolean
  ) {}
}
