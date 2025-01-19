import express from "express";
import { Container } from "inversify";
import { ICategorieFournisseurRepository } from "../interfaces/ICategorieFournisseurRepository";
import { INTERFACE_TYPE } from "../utils";
import { CategorieFournisseurRepository } from "../repositories/categorieFournisseurRepository";
import { ICategorieFournisseurInteractor } from "../interfaces/ICategorieFournisseurInteractor";
import { CategorieFournisseurInteractor } from "../interactors/categorieFournisseurInteractor";
import { IMailer } from "../interfaces/IMailer";
import { Mailer } from "../external-libraries/mailer";
import { IMessageBroker } from "../interfaces/IMessageBroker";
import { MessageBroker } from "../external-libraries/messageBroker";
import { CategorieFournisseurController } from "../controllers/categorieFournisseurController";
import multer from "multer";
import { storage } from "../index";

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // Set file size limit to 10MB (adjust as needed)
  },
});
const container = new Container();

container
  .bind<ICategorieFournisseurRepository>(
    INTERFACE_TYPE.CategorieFournisseurRepository
  )
  .to(CategorieFournisseurRepository);

container
  .bind<ICategorieFournisseurInteractor>(
    INTERFACE_TYPE.CategorieFournisseurInteractor
  )
  .to(CategorieFournisseurInteractor);

container.bind<IMailer>(INTERFACE_TYPE.Mailer).to(Mailer);

container.bind<IMessageBroker>(INTERFACE_TYPE.MessageBroker).to(MessageBroker);

container
  .bind<CategorieFournisseurController>(
    INTERFACE_TYPE.CategorieFournisseurController
  )
  .to(CategorieFournisseurController);

const categorieFournisseurRouter = express.Router();

const controller = container.get<CategorieFournisseurController>(
  INTERFACE_TYPE.CategorieFournisseurController
);

categorieFournisseurRouter.get(
  "/categories-fournisseurs",
  controller.getCategorieFournisseurs.bind(controller)
);

categorieFournisseurRouter.get(
  "/categories-fournisseurs/:id",
  controller.getCategorieFournisseur.bind(controller)
);

export default categorieFournisseurRouter;
