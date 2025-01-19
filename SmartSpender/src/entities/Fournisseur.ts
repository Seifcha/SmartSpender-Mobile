export class Fournisseur {
  constructor(
    public readonly IdFournisseur: number,
    public readonly idCategorieFournisseur,
    public readonly userEmail: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deleted: boolean,
    public readonly deletedAt: Date | null,
    public readonly nom: string,
    public readonly mail: string,
    public readonly phone: string,
    public readonly logo: Buffer,
    public readonly isPublicInt: number,
    public readonly valide: boolean
  ) {}
}
