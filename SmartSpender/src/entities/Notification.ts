export class Notification {
  constructor(
    public readonly idNotification: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deleted: boolean,
    public readonly deletedAt: Date | null,
    public readonly userEmail: string,
    public readonly title: string,
    public readonly body: string,
    public readonly image: Buffer,
    public readonly nomFournisseur: string,
    public readonly vu: boolean,
    public readonly idDepense: number,
    public readonly idRevenu: number,
    public readonly type: string
  ) {}
}
