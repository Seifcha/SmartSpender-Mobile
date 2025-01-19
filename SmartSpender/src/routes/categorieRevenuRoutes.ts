import express from "express";
import { Container } from "inversify";
import { ICategorieRevenuRepository } from "../interfaces/ICategorieRevenuRepository";
import { INTERFACE_TYPE } from "../utils";
import { CategorieRevenuRepository } from "../repositories/categorieRevenuRepository";
import { ICategorieRevenuInteractor } from "../interfaces/ICategorieRevenuInteractor";
import { CategorieRevenuInteractor } from "../interactors/categorieRevenuInteractor";

import { CategorieRevenuController } from "../controllers/categorieRevenuController";
import multer from "multer";
import { storage } from "../index";

const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});
const container = new Container();

container
  .bind<ICategorieRevenuRepository>(INTERFACE_TYPE.CategorieRevenuRepository)
  .to(CategorieRevenuRepository);

container
  .bind<ICategorieRevenuInteractor>(INTERFACE_TYPE.CategorieRevenuInteractor)
  .to(CategorieRevenuInteractor);

container
  .bind<CategorieRevenuController>(INTERFACE_TYPE.CategorieRevenuController)
  .to(CategorieRevenuController);

const categorieRevenuRouter = express.Router(); // Renommage de la variable router en categorieRevenuRouter

const controller = container.get<CategorieRevenuController>(
  INTERFACE_TYPE.CategorieRevenuController
);

categorieRevenuRouter.post(
  "/categories-revenus",
  upload.single("image"),
  controller.ajouterCategorieRevenu.bind(controller)
);

categorieRevenuRouter.get(
  "/categories-revenus/:userEmail",
  controller.getCategorieRevenus.bind(controller)
);
categorieRevenuRouter.get(
  "/categorie-revenu/:id",
  controller.getCategorieRevenu.bind(controller)
);

categorieRevenuRouter.put(
  "/categories-revenus/:id",
  upload.single("image"),
  controller.modifierCategorieRevenu.bind(controller)
);
categorieRevenuRouter.delete(
  "/categories-revenus/:id",
  controller.supprimerCategorieRevenu.bind(controller)
);
// categorieRevenuRouter.patch("/categories-revenus/:id/valider", controller.validerCategorieRevenu.bind(controller));

export default categorieRevenuRouter; // Exportation du router renommé
