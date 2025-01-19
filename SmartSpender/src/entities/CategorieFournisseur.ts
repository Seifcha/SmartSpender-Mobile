export class CategorieFournisseur {
    constructor(
      public readonly IdCategorieFournisseur: number,
      public readonly createdAt: Date,
      public readonly updatedAt: Date,
      public readonly deleted: boolean,
      public readonly deletedAt: Date,
      public readonly nomCategorie: string,
      public readonly image: Buffer,
  
  
    ) {}
  }
  
  