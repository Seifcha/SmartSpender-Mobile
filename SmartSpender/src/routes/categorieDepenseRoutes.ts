import express from "express";
import { Container } from "inversify";
import { ICategorieDepenseRepository } from "../interfaces/ICategorieDepenseRepository";
import { INTERFACE_TYPE } from "../utils";
import { CategorieDepenseRepository } from "../repositories/categorieDepenseRepository";
import { ICategorieDepenseInteractor } from "../interfaces/ICategorieDepenseInteractor";
import { CategorieDepenseInteractor } from "../interactors/categorieDepenseInteractor";

import { CategorieDepenseController } from "../controllers/categorieDepenseController";
import multer from "multer";
import { storage } from "../index";

const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});
const container = new Container();

container
  .bind<ICategorieDepenseRepository>(INTERFACE_TYPE.CategorieDepenseRepository)
  .to(CategorieDepenseRepository);

container
  .bind<ICategorieDepenseInteractor>(INTERFACE_TYPE.CategorieDepenseInteractor)
  .to(CategorieDepenseInteractor);

container
  .bind<CategorieDepenseController>(INTERFACE_TYPE.CategorieDepenseController)
  .to(CategorieDepenseController);

const categorieDepenseRouter = express.Router(); // Renommage de la variable router en categorieDepenseRouter

const controller = container.get<CategorieDepenseController>(
  INTERFACE_TYPE.CategorieDepenseController
);

categorieDepenseRouter.post(
  "/categories-depenses",
  upload.single("image"),
  controller.ajouterCategorieDepense.bind(controller)
);

categorieDepenseRouter.get(
  "/categories-depenses/:userEmail",
  controller.getCategorieDepenses.bind(controller)
);
categorieDepenseRouter.get(
  "/categorie-depense/:id",
  controller.getCategorieDepense.bind(controller)
);

categorieDepenseRouter.put(
  "/categories-depenses/:id",
  upload.single("image"),
  controller.modifierCategorieDepense.bind(controller)
);
categorieDepenseRouter.delete(
  "/categories-depenses/:id",
  controller.supprimerCategorieDepense.bind(controller)
);
// categorieDepenseRouter.patch("/categories-depenses/:id/valider", controller.validerCategorieDepense.bind(controller));

export default categorieDepenseRouter; // Exportation du router renommé
