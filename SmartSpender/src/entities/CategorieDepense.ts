export class CategorieDepense {
  constructor(
    public readonly IdCategorie: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deleted: boolean,
    public readonly deletedAt: Date,
    public readonly nomCategorie: string,
    public readonly isPublicInt: number,
    public readonly validated: boolean,
    public readonly image: Buffer,
    public readonly possedeFournisseurDepenseInt: number,
    public Seuil: number,
    public readonly userEmail: string
  ) {}
}
