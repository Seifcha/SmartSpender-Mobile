import express from "express";
import { Container } from "inversify";
import { IRevenuRepository } from "../interfaces/IRevenuRepository";
import { INTERFACE_TYPE } from "../utils";
import { RevenuRepository } from "../repositories/revenuRepository";
import { IRevenuInteractor } from "../interfaces/IRevenuInteractor";
import { RevenuInteractor } from "../interactors/revenuInteractor";

import { RevenuController } from "../controllers/revenuController";

const container = new Container();

container
  .bind<IRevenuRepository>(INTERFACE_TYPE.RevenuRepository)
  .to(RevenuRepository);

container
  .bind<IRevenuInteractor>(INTERFACE_TYPE.RevenuInteractor)
  .to(RevenuInteractor);

container
  .bind<RevenuController>(INTERFACE_TYPE.RevenuController)
  .to(RevenuController);

const RevenuRouter = express.Router(); // Renommage de la variable router en RevenuRouter

const controller = container.get<RevenuController>(
  INTERFACE_TYPE.RevenuController
);

RevenuRouter.post("/revenu", controller.ajouterRevenu.bind(controller));

RevenuRouter.get("/revenus/:userEmail", controller.getRevenus.bind(controller));
RevenuRouter.get("/revenu/:id", controller.getRevenu.bind(controller));

// RevenuRouter.put(
//   "/s-revenus/:id",
//   upload.single("image"),
//   controller.modifierRevenu.bind(controller)
// );
RevenuRouter.delete("/revenu/:id", controller.supprimerRevenu.bind(controller));
// RevenuRouter.patch("/s-revenus/:id/valider", controller.validerRevenu.bind(controller));

export default RevenuRouter; // Exportation du router renommé
