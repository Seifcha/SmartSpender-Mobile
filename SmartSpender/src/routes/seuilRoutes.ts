import express from "express";
import { Container } from "inversify";
import { ISeuilRepository } from "../interfaces/ISeuilRepository";
import { INTERFACE_TYPE } from "../utils";
import { SeuilRepository } from "../repositories/seuilRepository";
import { ISeuilInteractor } from "../interfaces/ISeuilInteractor"; // Correction ici

import { SeuilController } from "../controllers/seuilController";
import { SeuilInteractor } from "../interactors/seuilInteractor";

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
  .bind<ISeuilRepository>(INTERFACE_TYPE.SeuilRepository)
  .to(SeuilRepository);

container
  .bind<ISeuilInteractor>(INTERFACE_TYPE.SeuilInteractor)
  .to(SeuilInteractor); // Correction ici

container
  .bind<SeuilController>(INTERFACE_TYPE.SeuilController)
  .to(SeuilController);

const seuilrouter = express.Router();

const controller = container.get<SeuilController>(
  INTERFACE_TYPE.SeuilController
);

seuilrouter.post(
  "/seuilDepense/:userEmail",
  controller.ajouterSeuil.bind(controller)
);

seuilrouter.get(
  "/seuilDepense/:userEmail",
  // upload.single("image"),
  controller.getSeuils.bind(controller)
);

seuilrouter.get(
  "/seuilsRestes/:categorieDepense/:userEmail",
  controller.getSeuilByCategorieDepense.bind(controller)
);
seuilrouter.get(
  "/seuilsRestesSousCategorie/:sousCategorie/:userEmail",
  controller.getSeuilBySousCategorieDepense.bind(controller)
);

seuilrouter.get("/seuil/:id", controller.getSeuil.bind(controller));

seuilrouter.put("/seuil/:id", controller.modifierSeuil.bind(controller));
seuilrouter.delete("/seuil/:id", controller.supprimerSeuil.bind(controller));

export default seuilrouter;
