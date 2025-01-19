import express from "express";
import { Container } from "inversify";
import { ITransfertRepository } from "../interfaces/ITransfertRepository";
import { INTERFACE_TYPE } from "../utils";
import { TransfertRepository } from "../repositories/transfertRepository";
import { ITransfertInteractor } from "../interfaces/ITransfertInteractor";
import { TransfertInteractor } from "../interactors/transfertInteractor";

import { TransfertController } from "../controllers/transfertController";

const container = new Container();

container
  .bind<ITransfertRepository>(INTERFACE_TYPE.TransfertRepository)
  .to(TransfertRepository);

container
  .bind<ITransfertInteractor>(INTERFACE_TYPE.TransfertInteractor)
  .to(TransfertInteractor);

container
  .bind<TransfertController>(INTERFACE_TYPE.TransfertController)
  .to(TransfertController);

const TransfertRouter = express.Router(); // Renommage de la variable router en TransfertRouter

const controller = container.get<TransfertController>(
  INTERFACE_TYPE.TransfertController
);

TransfertRouter.post(
  "/transfert",
  controller.ajouterTransfert.bind(controller)
);

TransfertRouter.get(
  "/transferts/:userEmail",
  controller.getTransferts.bind(controller)
);
TransfertRouter.get("/transfert/:id", controller.getTransfert.bind(controller));

// // TransfertRouter.put(
// //   "/s-transferts/:id",
// //   upload.single("image"),
// //   controller.modifierTransfert.bind(controller)
// // );
TransfertRouter.delete(
  "/transfert/:id",
  controller.supprimerTransfert.bind(controller)
);
// TransfertRouter.patch("/s-transferts/:id/valider", controller.validerTransfert.bind(controller));

export default TransfertRouter; // Exportation du router renommé
