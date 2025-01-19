import Buffer from "buffer";

export class Seuil {
  constructor(
    public readonly idSeuil: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly deleted: boolean,
    public readonly categorieOuSousCategorie: string,
    public readonly montant: number,
    public readonly sommeMontants: number,
    public readonly periode: string,
    public readonly idCategorieOuSousCategorie: number,
    public readonly userEmail: string,
    public readonly imageCategorieOuSousCategorie: Buffer, // Ajout du champ image
    public readonly nomCategorieOuSousCategorie: string, // Ajout du champ image
    public readonly dateFin: string // Ajout du champ image
  ) {}
}
