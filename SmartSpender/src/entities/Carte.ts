export class Carte {
  constructor(
    public readonly idCarte: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly deleted: boolean,
    public readonly numCarte: string | null,
    public readonly typeCarte: string | null,
    public readonly dateExpiration: string | null,
    public readonly idCompte: number | null,
    public readonly userEmail: string
  ) {}
}
