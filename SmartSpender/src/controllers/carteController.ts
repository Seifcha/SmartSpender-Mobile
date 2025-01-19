import { NextFunction, Request, Response } from "express";
import { ICarteInteractor } from "../interfaces/ICarteInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
import { Carte } from "../entities/Carte";

@injectable()
export class CarteController {
  private interactor: ICarteInteractor;

  constructor(
    @inject(INTERFACE_TYPE.CarteInteractor)
    interactor: ICarteInteractor
  ) {
    this.interactor = interactor;
  }

  async ajouterCarte(req: Request, res: Response, next: NextFunction) {
    try {
      const { numCarte, typeCarte, dateExpiration, idCompte, userEmail } =
        req.body;
      // Ajouter la sous-catégorie de dépense en utilisant l'interactor
      const data = await this.interactor.ajouterCarte({
        numCarte,
        typeCarte,
        dateExpiration,
        idCompte,
        userEmail,
      });

      // Retourner les données ajoutées avec le code de statut 200 (OK)
      return res.status(200).json(data);
    } catch (error) {
      // Passer l'erreur au gestionnaire d'erreurs suivant
      next(error);
    }
  }

  async getCartes(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.params.userEmail;

      const data = await this.interactor.getCartes(userEmail);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getCarte(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.getCarte(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async modifierCarte(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      const { dateExpiration } = req.body;

      // Modifier la sous-catégorie de dépense en utilisant l'interactor
      const data = await this.interactor.modifierCarte(id, dateExpiration);

      // Retourner les données modifiées avec le code de statut 200 (OK)
      return res.status(200).json(data);
    } catch (error) {
      // Passer l'erreur au gestionnaire d'erreurs suivant
      next(error);
    }
  }

  async supprimerCarte(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      // Supprimer la sous-catégorie de dépense en utilisant l'interactor
      const success = await this.interactor.supprimerCarte(id);

      // Retourner le résultat de la suppression avec le code de statut 200 (OK)
      return res.status(200).json({ success });
    } catch (error) {
      // Passer l'erreur au gestionnaire d'erreurs suivant
      next(error);
    }
  }

  async getCartesByCompte(req: Request, res: Response, next: NextFunction) {
    try {
      const idCompte = parseInt(req.params.idCompte);
      const userEmail = req.params.userEmail;

      const data = await this.interactor.getCartesByCompte(userEmail, idCompte);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
