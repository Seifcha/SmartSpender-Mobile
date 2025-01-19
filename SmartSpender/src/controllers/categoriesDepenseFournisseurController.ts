import { NextFunction, Request, Response } from "express";
import { ICategorieDepenseFournisseurInteractor } from "../interfaces/ICategorieDepenseFournisseurInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
// import multer from 'multer';
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
@injectable()
export class CategorieDepenseFournisseurController {
  private interactor: ICategorieDepenseFournisseurInteractor;

  constructor(
    @inject(INTERFACE_TYPE.CategorieDepenseFournisseurInteractor)
    interactor: ICategorieDepenseFournisseurInteractor
  ) {
    this.interactor = interactor;
  }

  async getCategorieDepenseFournisseurs(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const idCategorieDepense = parseInt(req.params.id);
      console.log(idCategorieDepense);
      const data = await this.interactor.getCategoriesDepenseFournisseur(
        idCategorieDepense
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
