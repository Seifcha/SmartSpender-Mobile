export class CategorieRevenu {
  constructor(
    public IdCategorie: number,
    public createdAt: Date,
    public updatedAt: Date,
    public deleted: boolean,
    public deletedAt: Date | null,
    public nomCategorie: string,
    public readonly isPublicInt: number,
    public validated: boolean, // Ensure this field is defined
    public image: string,
    public readonly possedeFournisseurRevenuInt: number,
    public userEmail: string
  ) {}
}
