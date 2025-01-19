import express from "express";
import { Container } from "inversify";
import { ISousCategorieDepenseRepository } from "../interfaces/ISousCategorieDepenseRepository";
import { INTERFACE_TYPE } from "../utils";
import { SousCategorieDepenseRepository } from "../repositories/sousCategorieDepenseRepository";
import { ISousCategorieDepenseInteractor } from "../interfaces/ISousCategorieDepenseInteractor"; // Correction ici
import { SousCategorieDepenseController } from "../controllers/sousCategorieDepenseController";
import { SousCategorieDepenseInteractor } from "../interactors/sousCategorieDepenseInteractor";
import { CategorieDepenseRepository } from "../repositories/categorieDepenseRepository"; // Ajout ici
import { ICategorieDepenseRepository } from "../interfaces/ICategorieDepenseRepository";
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
  .bind<ISousCategorieDepenseRepository>(
    INTERFACE_TYPE.SousCategorieDepenseRepository
  )
  .to(SousCategorieDepenseRepository);

container
  .bind<ISousCategorieDepenseInteractor>(
    INTERFACE_TYPE.SousCategorieDepenseInteractor
  )
  .to(SousCategorieDepenseInteractor); // Correction ici

container
  .bind<SousCategorieDepenseController>(
    INTERFACE_TYPE.SousCategorieDepenseController
  )
  .to(SousCategorieDepenseController);

// Ajout de la liaison pour CategorieDepenseRepository
container
  .bind<ICategorieDepenseRepository>(INTERFACE_TYPE.CategorieDepenseRepository)
  .to(CategorieDepenseRepository);

const sousCategorieDepenseRouter = express.Router();

const controller = container.get<SousCategorieDepenseController>(
  INTERFACE_TYPE.SousCategorieDepenseController
);

sousCategorieDepenseRouter.post(
  "/sous-categories-depense",
  upload.single("image"),
  controller.ajouterSousCategorie.bind(controller)
);
sousCategorieDepenseRouter.get(
  "/sous-categories-depenses/:userEmail/:id",
  upload.single("image"),
  controller.getSousCategories.bind(controller)
);
sousCategorieDepenseRouter.get(
  "/sous-categorie-depense/:id",
  controller.getSousCategorie.bind(controller)
);

sousCategorieDepenseRouter.put(
  "/sous-categorie-depense/:id",
  upload.single("image"),
  controller.modifierSousCategorie.bind(controller)
);
sousCategorieDepenseRouter.delete(
  "/sous-categories-depenses/:id",
  controller.supprimerSousCategorie.bind(controller)
);

export default sousCategorieDepenseRouter;
