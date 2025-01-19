import { NextFunction, Request, Response } from "express";
import { ISeuilInteractor } from "../interfaces/ISeuilInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
import { Seuil } from "../entities/Seuil";

@injectable()
export class SeuilController {
  private interactor: ISeuilInteractor;

  constructor(
    @inject(INTERFACE_TYPE.SeuilInteractor)
    interactor: ISeuilInteractor
  ) {
    this.interactor = interactor;
  }

  async ajouterSeuil(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        montant,
        periode,
        categorieOuSousCategorie,
        idCategorieOuSousCategorie,
      } = req.body;
      const userEmail = req.params.userEmail;
      console.log("periode ,", periode);
      // Ajouter la sous-catégorie de dépense en utilisant l'interactor
      const data = await this.interactor.ajouterSeuil({
        userEmail,
        montant,
        periode,
        categorieOuSousCategorie,
        idCategorieOuSousCategorie,
      });

      // Retourner les données ajoutées avec le code de statut 200 (OK)
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getSeuils(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getSeuils(userEmail);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getSeuil(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.getSeuil(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getSeuilByCategorieDepense(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categorieDepense = parseInt(req.params.categorieDepense);
      console.log("reste de", categorieDepense);
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getSeuilByCategorieDepense(
        categorieDepense,
        userEmail
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getSeuilBySousCategorieDepense(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const sousCategorie = parseInt(req.params.sousCategorie);
      console.log("reste de souscategorie", sousCategorie);
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getSeuilBySousCategorieDepense(
        sousCategorie,
        userEmail
      );
      console.log("array:", data);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async modifierSeuil(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      const { montant, periode } = req.body;

      // Modifier la sous-catégorie de dépense en utilisant l'interactor
      const data = await this.interactor.modifierSeuil(id, montant, periode);

      // Retourner les données modifiées avec le code de statut 200 (OK)
      return res.status(200).json(data);
    } catch (error) {
      // Passer l'erreur au gestionnaire d'erreurs suivant
      next(error);
    }
  }

  async supprimerSeuil(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      // Supprimer la sous-catégorie de dépense en utilisant l'interactor
      const success = await this.interactor.supprimerSeuil(id);

      // Retourner le résultat de la suppression avec le code de statut 200 (OK)
      return res.status(200).json({ success });
    } catch (error) {
      // Passer l'erreur au gestionnaire d'erreurs suivant
      next(error);
    }
  }
}
