import Buffer from "buffer";

export class User {
  constructor(
    public readonly id: number,
    public readonly nom: string,
    public readonly prenom: string,
    public readonly dateNaissance: Date,
    public readonly genre: string,
    public readonly hashedPwd: string,
    public readonly phone: string,
    public readonly adresse: string,
    public readonly email: string,
    public readonly photoProfil: Buffer,
    public readonly domaineTravail: Buffer,
    public readonly posteTravail: string,
    public readonly resetCodePhone: string,
    public readonly resetCodeMail: string,
    public readonly isMailValidated: boolean,
    public readonly isPhoneValidated: boolean,
    public readonly actif: boolean
  ) {}
}
