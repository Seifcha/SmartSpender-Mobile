import { NextFunction, Request, Response } from "express";
import { ICategorieRevenuFournisseurInteractor } from "../interfaces/ICategorieRevenuFournisseurInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
// import multer from 'multer';
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
@injectable()
export class CategorieRevenuFournisseurController {
  private interactor: ICategorieRevenuFournisseurInteractor;

  constructor(
    @inject(INTERFACE_TYPE.CategorieRevenuFournisseurInteractor)
    interactor: ICategorieRevenuFournisseurInteractor
  ) {
    this.interactor = interactor;
  }

  async getCategorieRevenuFournisseurs(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const idCategorieRevenu = parseInt(req.params.id);
      console.log(idCategorieRevenu);
      const data = await this.interactor.getCategoriesRevenuFournisseur(
        idCategorieRevenu
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
