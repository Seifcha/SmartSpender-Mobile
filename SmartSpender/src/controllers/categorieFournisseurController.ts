import { NextFunction, Request, Response } from "express";
import { ICategorieFournisseurInteractor } from "../interfaces/ICategorieFournisseurInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
import { CategorieFournisseur } from "../entities/CategorieFournisseur";

@injectable()
export class CategorieFournisseurController {
  private interactor: ICategorieFournisseurInteractor;

  constructor(
    @inject(INTERFACE_TYPE.CategorieFournisseurInteractor)
    interactor: ICategorieFournisseurInteractor
  ) {
    this.interactor = interactor;
  }

  async getCategorieFournisseurs(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("controller");
      let limit: number | undefined =
        parseInt(req.query.limit as string) || undefined;
      const offset: number = parseInt(req.query.offset as string) || 0;

      if (!limit) {
        limit = undefined; // Définir la limite sur undefined pour récupérer tous les fournisseurs
      }
      console.log("controller");
      const data = await this.interactor.getCategorieFournisseurs(
        limit,
        offset
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getCategorieFournisseur(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.getCategorieFournisseur(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
