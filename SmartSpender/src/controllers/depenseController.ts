import { NextFunction, Request, Response } from "express";
import { IDepenseInteractor } from "../interfaces/IDepenseInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class DepenseController {
  private interactor: IDepenseInteractor;

  constructor(
    @inject(INTERFACE_TYPE.DepenseInteractor)
    interactor: IDepenseInteractor
  ) {
    this.interactor = interactor;
  }

  async ajouterDepense(req: Request, res: Response, next: NextFunction) {
    try {
      let {
        recurrente,
        recurrenceOption,
        description,
        dateDepense,
        categorieDepense,
        sousCategorie,
        fournisseur,
        montant,
        transactions,
        userEmail,
      } = req.body;

      if (sousCategorie == "null") {
        sousCategorie = null;
      }
      if (categorieDepense == "null") {
        categorieDepense = null;
      }
      if (fournisseur == "null") {
        fournisseur = null;
      }

      const checkDepasseMontant = await this.interactor.checkMontant(
        transactions,
        userEmail
      );
      if (!checkDepasseMontant) {
        const depense = await this.interactor.ajouterDepense({
          recurrente,
          recurrenceOption,
          description,
          dateDepense,
          categorieDepense,
          sousCategorie,
          fournisseur,
          montant,
          transactions,
          userEmail,
        });

        if (categorieDepense) {
          await this.interactor.ajouterSeuilCategorie(
            categorieDepense,
            userEmail,
            montant
          );
        }
        if (sousCategorie) {
          await this.interactor.ajouterSeuilSousCategorie(
            sousCategorie,
            userEmail,
            montant
          );
        }
        const data = await this.interactor.ajouterTransactions(
          transactions,
          depense.idDepense,
          userEmail
        );

        // Si la dépense est récurrente, planifier une tâche récurrente
        if (recurrente) {
          await this.interactor.scheduleRecurrentTask(
            depense.idDepense,
            recurrente,
            recurrenceOption,
            description,
            dateDepense,
            categorieDepense,
            sousCategorie,
            fournisseur,
            montant,
            transactions,
            userEmail
          );
        }
        return res.status(201).json(data);
      } else {
        return res.status(400).json({
          errorMessage:
            "Le budget dans votre compte dépasse le montant de la dépense.",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getDepenses(req: Request, res: Response, next: NextFunction) {
    try {
      // const { id, token } = req.params;

      // const decodedToken = jwt.verify(token, "jwt_secret_key");
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getDepenses(userEmail);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async supprimerDepense(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      const success = await this.interactor.deleteDepense(id);

      return res.status(200).json({ success });
    } catch (error) {
      next(error);
    }
  }

  async getDepense(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.getDepense(id);
      //   console.log(data);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
