import express from "express";
import { Container } from "inversify";
import { ICarteRepository } from "../interfaces/ICarteRepository";
import { INTERFACE_TYPE } from "../utils";
import { CarteRepository } from "../repositories/carteRepository";
import { ICarteInteractor } from "../interfaces/ICarteInteractor"; // Correction ici
import { CarteController } from "../controllers/carteController";
import { CarteInteractor } from "../interactors/carteInteractor";

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
  .bind<ICarteRepository>(INTERFACE_TYPE.CarteRepository)
  .to(CarteRepository);

container
  .bind<ICarteInteractor>(INTERFACE_TYPE.CarteInteractor)
  .to(CarteInteractor); // Correction ici

container
  .bind<CarteController>(INTERFACE_TYPE.CarteController)
  .to(CarteController);

// Ajout de la liaison pour CompteRepository

const carteRouter = express.Router();

const controller = container.get<CarteController>(
  INTERFACE_TYPE.CarteController
);

carteRouter.post("/ajouter-carte", controller.ajouterCarte.bind(controller));
carteRouter.get("/cartes/:userEmail", controller.getCartes.bind(controller));
carteRouter.get("/carte/:id/", controller.getCarte.bind(controller));

carteRouter.put("/carte/:id", controller.modifierCarte.bind(controller));
carteRouter.delete("/carte/:id/", controller.supprimerCarte.bind(controller));
carteRouter.get(
  "/carte/:idCompte/:userEmail",
  controller.getCartesByCompte.bind(controller)
);

export default carteRouter;
