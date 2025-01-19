import { NextFunction, Request, Response } from "express";
import { IDashboardInteractor } from "../interfaces/IDashboardInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
// import multer from 'multer';
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
@injectable()
export class DashboardController {
  private interactor: IDashboardInteractor;

  constructor(
    @inject(INTERFACE_TYPE.DashboardInteractor)
    interactor: IDashboardInteractor
  ) {
    this.interactor = interactor;
  }

  async getSommeMontants(req: Request, res: Response, next: NextFunction) {
    try {
      // const { id, token } = req.params;

      // const decodedToken = jwt.verify(token, "jwt_secret_key");
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getSommeMontants(userEmail);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getSommeDepense(req: Request, res: Response, next: NextFunction) {
    try {
      // const { id, token } = req.params;

      // const decodedToken = jwt.verify(token, "jwt_secret_key");
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getSommeDepense(userEmail);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getSommeRevenu(req: Request, res: Response, next: NextFunction) {
    try {
      // const { id, token } = req.params;

      // const decodedToken = jwt.verify(token, "jwt_secret_key");
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getSommeRevenu(userEmail);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getFournisseurRevenuEtDepense(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // const { id, token } = req.params;

      // const decodedToken = jwt.verify(token, "jwt_secret_key");
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getFournisseurRevenuEtDepense(
        userEmail
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
