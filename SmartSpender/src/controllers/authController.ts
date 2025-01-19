// import jwt from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";
import { IAuthInteractor } from "../interfaces/IAuthInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";

const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
require("dotenv").config();

@injectable()
export class AuthController {
  private interactor: IAuthInteractor;

  constructor(
    @inject(INTERFACE_TYPE.AuthInteractor) interactor: IAuthInteractor
  ) {
    this.interactor = interactor;
  }

  async onAuthenticate(req: Request, res: Response, next: NextFunction) {
    const { userEmail, mdp } = req.body;
    console.log(userEmail);
    console.log(mdp);
    if (!userEmail || !mdp)
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    const foundUser = await this.interactor.authenticate(userEmail);
    // console.log("ba3d controller");
    if (!foundUser) {
      return res.sendStatus(401);
    }
    try {
      const match = await bcrypt.compare(mdp, foundUser.hashedPwd);
      console.log("match: ", match);
      if (!match) {
        res.sendStatus(401);
      } else {
        res.sendStatus(201);
      }
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
