import express from "express";
import { Container } from "inversify";
import { IDashboardRepository } from "../interfaces/IDashboardRepository";
import { INTERFACE_TYPE } from "../utils";
import { DashboardRepository } from "../repositories/dashboardRepository";
import { IDashboardInteractor } from "../interfaces/IDashboardInteractor";
import { DashboardInteractor } from "../interactors/dashboardInteractor";

import { DashboardController } from "../controllers/dashboardController";
import multer from "multer";
import { storage } from "../index";

const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});
const container = new Container();

container
  .bind<IDashboardRepository>(INTERFACE_TYPE.DashboardRepository)
  .to(DashboardRepository);

container
  .bind<IDashboardInteractor>(INTERFACE_TYPE.DashboardInteractor)
  .to(DashboardInteractor);

container
  .bind<DashboardController>(INTERFACE_TYPE.DashboardController)
  .to(DashboardController);

const dashboardRouter = express.Router(); // Renommage de la variable router en dashboardRouter

const controller = container.get<DashboardController>(
  INTERFACE_TYPE.DashboardController
);

// dashboardRouter.post(
//   "/categories-depenses",
//   upload.single("image"),
//   controller.ajouterDashboard.bind(controller)
// );

dashboardRouter.get(
  "/sommeMontant/:userEmail",
  controller.getSommeMontants.bind(controller)
);
dashboardRouter.get(
  "/sommeDepense/:userEmail",
  controller.getSommeDepense.bind(controller)
);
dashboardRouter.get(
  "/sommeRevenu/:userEmail",
  controller.getSommeRevenu.bind(controller)
);
// dashboardRouter.get(
//   "/fournisseurRevenu/:userEmail",
//   controller.getFournisseurRevenu.bind(controller)
// );
// dashboardRouter.get(
//   "/fournisseurDepense/:userEmail",
//   controller.getFournisseurDepense.bind(controller)
// );
dashboardRouter.get(
  "/sommeFournisseurs/:userEmail",
  controller.getFournisseurRevenuEtDepense.bind(controller)
);
// dashboardRouter.put(
//   "/categories-depenses/:id",
//   upload.single("image"),
//   controller.modifierDashboard.bind(controller)
// );
// dashboardRouter.delete(
//   "/categories-depenses/:id",
//   controller.supprimerDashboard.bind(controller)
// );
// dashboardRouter.patch("/categories-depenses/:id/valider", controller.validerDashboard.bind(controller));

export default dashboardRouter; // Exportation du router renommé
