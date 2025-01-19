import express from "express";
import { Container } from "inversify";
import { IDepenseRepository } from "../interfaces/IDepenseRepository";
import { INTERFACE_TYPE } from "../utils";
import { DepenseRepository } from "../repositories/depenseRepository";
import { IDepenseInteractor } from "../interfaces/IDepenseInteractor";
import { DepenseInteractor } from "../interactors/depenseInteractor";

import { DepenseController } from "../controllers/depenseController";

const container = new Container();

container
  .bind<IDepenseRepository>(INTERFACE_TYPE.DepenseRepository)
  .to(DepenseRepository);

container
  .bind<IDepenseInteractor>(INTERFACE_TYPE.DepenseInteractor)
  .to(DepenseInteractor);

container
  .bind<DepenseController>(INTERFACE_TYPE.DepenseController)
  .to(DepenseController);

const DepenseRouter = express.Router(); // Renommage de la variable router en DepenseRouter

const controller = container.get<DepenseController>(
  INTERFACE_TYPE.DepenseController
);

DepenseRouter.post("/depense", controller.ajouterDepense.bind(controller));

// DepenseRouter.get(
//   "/depenses/:userEmail",
//   controller.getDepenses.bind(controller)
// );
DepenseRouter.get("/depense/:id", controller.getDepense.bind(controller));
DepenseRouter.get(
  "/depenses/:userEmail",
  controller.getDepenses.bind(controller)
);

// DepenseRouter.put(
//   "/s-depenses/:id",
//   upload.single("image"),
//   controller.modifierDepense.bind(controller)
// );
DepenseRouter.delete(
  "/depense/:id",
  controller.supprimerDepense.bind(controller)
);
// DepenseRouter.patch("/s-depenses/:id/valider", controller.validerDepense.bind(controller));

export default DepenseRouter; // Exportation du router renommé
