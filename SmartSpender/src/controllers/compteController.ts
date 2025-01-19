import { NextFunction, Request, Response } from "express";
import { ICompteInteractor } from "../interfaces/ICompteInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
import { Compte } from "../entities/Compte";

@injectable()
export class CompteController {
  private interactor: ICompteInteractor;

  constructor(
    @inject(INTERFACE_TYPE.CompteInteractor)
    interactor: ICompteInteractor
  ) {
    this.interactor = interactor;
  }
  async ajouterCompte(req: Request, res: Response, next: NextFunction) {
    try {
      let {
        solde,
        iban,
        typeCompte,
        status,
        creditLign,
        nomCompte,
        userEmail,
        tauxInteret,
      } = req.body;
      if (creditLign === "null") {
        creditLign = 0;
      }
      if (tauxInteret === "null") {
        tauxInteret = 0;
      }
      console.log(tauxInteret);
      console.log(typeof tauxInteret);
      // Ajouter la sous-catégorie de dépense en utilisant l'interactor
      const data = await this.interactor.ajouterCompte({
        solde,
        iban,
        typeCompte,
        status,
        creditLign,
        nomCompte,
        userEmail,
        tauxInteret,
      });

      // Retourner les données ajoutées avec le code de statut 200 (OK)
      return res.status(200).json(data);
    } catch (error) {
      // Passer l'erreur au gestionnaire d'erreurs suivant
      next(error);
    }
  }

  async getComptes(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getComptes(userEmail);
      console.log(data);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getComptesByCarteType(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.params.userEmail;
      const typeCarte = req.params.typeCarte;
      console.log("chfama ta7t hedhi charga");
      console.log(userEmail);
      console.log(typeCarte);
      const data = await this.interactor.getComptesBancaires(
        userEmail,
        typeCarte
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getCompte(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.getCompte(id);
      console.log(data);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async modifierCompte(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const { solde, status, creditLign, nomCompte, userEmail } = req.body;

      // Modifier la sous-catégorie de dépense en utilisant l'interactor
      const data = await this.interactor.modifierCompte(
        solde,
        status,
        creditLign,
        nomCompte,
        id
      );

      // Retourner les données modifiées avec le code de statut 200 (OK)
      return res.status(200).json(data);
    } catch (error) {
      // Passer l'erreur au gestionnaire d'erreurs suivant
      next(error);
    }
  }

  async supprimerCompte(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      // Supprimer la sous-catégorie de dépense en utilisant l'interactor
      const success = await this.interactor.supprimerCompte(id);

      // Retourner le résultat de la suppression avec le code de statut 200 (OK)
      return res.status(200).json({ success });
    } catch (error) {
      // Passer l'erreur au gestionnaire d'erreurs suivant
      next(error);
    }
  }

  async getCompteByType(req: Request, res: Response, next: NextFunction) {
    try {
      const typeCompte = req.params.typeCompte;
      const userEmail = req.params.userEmail;
      console.log(typeCompte);
      console.log(userEmail);
      const data = await this.interactor.getCompteByType(typeCompte, userEmail);
      console.log(data);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
