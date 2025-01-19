import { NextFunction, Request, Response } from "express";
import { IRevenuInteractor } from "../interfaces/IRevenuInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class RevenuController {
  private interactor: IRevenuInteractor;

  constructor(
    @inject(INTERFACE_TYPE.RevenuInteractor)
    interactor: IRevenuInteractor
  ) {
    this.interactor = interactor;
  }

  async ajouterRevenu(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("ajout");
      let {
        recurrente,
        recurrenceOption,
        description,
        dateRevenu,
        categorieRevenu,
        fournisseur,
        montant,
        transactions,
        userEmail,
      } = req.body;
      console.log(montant);

      if (categorieRevenu == "null") {
        categorieRevenu = null;
      }
      if (fournisseur == "null") {
        fournisseur = null;
      }

      const revenu = await this.interactor.ajouterRevenu({
        recurrente,
        recurrenceOption,
        description,
        dateRevenu,
        categorieRevenu,
        fournisseur,
        montant,
        transactions,
        userEmail,
      });

      const data = await this.interactor.ajouterTransactions(
        transactions,
        revenu.idRevenu,
        userEmail
      );

      // Si la dépense est récurrente, planifier une tâche récurrente
      if (recurrente) {
        await this.interactor.scheduleRecurrentTask(
          revenu.idRevenu,
          recurrente,
          recurrenceOption,
          description,
          dateRevenu,
          categorieRevenu,
          fournisseur,
          montant,
          transactions,
          userEmail
        );
      }

      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async supprimerRevenu(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      const success = await this.interactor.deleteRevenu(id);

      return res.status(200).json({ success });
    } catch (error) {
      next(error);
    }
  }
  async getRevenus(req: Request, res: Response, next: NextFunction) {
    try {
      // const { id, token } = req.params;

      // const decodedToken = jwt.verify(token, "jwt_secret_key");
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getRevenus(userEmail);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getRevenu(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      console.log("id: ", id);
      const data = await this.interactor.getRevenu(id);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
