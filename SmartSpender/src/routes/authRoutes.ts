import express from "express";
import { Container } from "inversify";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { INTERFACE_TYPE } from "../utils";
import { AuthRepository } from "../repositories/authRepository";
import { IAuthInteractor } from "../interfaces/IAuthInteractor";
import { AuthInteractor } from "../interactors/authInteractor";
import { AuthController } from "../controllers/authController";

const container = new Container();
container
  .bind<IAuthRepository>(INTERFACE_TYPE.AuthRepository)
  .to(AuthRepository);

container
  .bind<IAuthInteractor>(INTERFACE_TYPE.AuthInteractor)
  .to(AuthInteractor);

container.bind(INTERFACE_TYPE.AuthController).to(AuthController);

const router = express.Router();

const controller = container.get<AuthController>(INTERFACE_TYPE.AuthController);

router.post("/auth", controller.onAuthenticate.bind(controller));

export default router;
