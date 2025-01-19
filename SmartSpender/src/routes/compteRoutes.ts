import express from "express";
import { Container } from "inversify";
import { ICompteRepository } from "../interfaces/ICompteRepository";
import { INTERFACE_TYPE } from "../utils";
import { CompteRepository } from "../repositories/compteRepository";
import { ICompteInteractor } from "../interfaces/ICompteInteractor"; // Correction ici
import { CompteController } from "../controllers/compteController";
import { CompteInteractor } from "../interactors/compteInteractor";

// import multer from "multer";
// import { storage } from "../index";

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 200 * 1024 * 1024, // Set file size limit to 10MB (adjust as needed)
//   },
// });
const container = new Container();

container
  .bind<ICompteRepository>(INTERFACE_TYPE.CompteRepository)
  .to(CompteRepository);

container
  .bind<ICompteInteractor>(INTERFACE_TYPE.CompteInteractor)
  .to(CompteInteractor); // Correction ici

container
  .bind<CompteController>(INTERFACE_TYPE.CompteController)
  .to(CompteController);

const compteRouter = express.Router();

const controller = container.get<CompteController>(
  INTERFACE_TYPE.CompteController
);

compteRouter.post("/ajouter-compte", controller.ajouterCompte.bind(controller));
compteRouter.get("/comptes/:userEmail", controller.getComptes.bind(controller));
compteRouter.get(
  "/comptes/:typeCarte/:userEmail",
  controller.getComptesByCarteType.bind(controller)
);
compteRouter.get("/compte/:id", controller.getCompte.bind(controller));
compteRouter.get(
  "/compte/:typeCompte/:userEmail",
  controller.getCompteByType.bind(controller)
);

compteRouter.put("/compte/:id", controller.modifierCompte.bind(controller));
compteRouter.delete("/compte/:id", controller.supprimerCompte.bind(controller));

export default compteRouter;
