import express from "express";
import { Container } from "inversify";
import { ICategorieRevenuFournisseurRepository } from "../interfaces/ICategorieRevenuFournisseurRepository";
import { INTERFACE_TYPE } from "../utils";
import { CategorieRevenuFournisseurRepository } from "../repositories/categoriesRevenuFournisseurRepository";
import { ICategorieRevenuFournisseurInteractor } from "../interfaces/ICategorieRevenuFournisseurInteractor";
import { CategorieRevenuFournisseurInteractor } from "../interactors/categoriesRevenuFournisseurInteractor";

import { CategorieRevenuFournisseurController } from "../controllers/categoriesRevenuFournisseurController";
import multer from "multer";
import { storage } from "../index";

const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});
const container = new Container();

container
  .bind<ICategorieRevenuFournisseurRepository>(
    INTERFACE_TYPE.CategorieRevenuFournisseurRepository
  )
  .to(CategorieRevenuFournisseurRepository);

container
  .bind<ICategorieRevenuFournisseurInteractor>(
    INTERFACE_TYPE.CategorieRevenuFournisseurInteractor
  )
  .to(CategorieRevenuFournisseurInteractor);

container
  .bind<CategorieRevenuFournisseurController>(
    INTERFACE_TYPE.CategorieRevenuFournisseurController
  )
  .to(CategorieRevenuFournisseurController);

const categoriesRevenuFournisseurRouter = express.Router(); // Renommage de la variable router en categorieRevenuRouter

const controller = container.get<CategorieRevenuFournisseurController>(
  INTERFACE_TYPE.CategorieRevenuFournisseurController
);

categoriesRevenuFournisseurRouter.get(
  "/categories-revenu-fournisseur/:id",
  controller.getCategorieRevenuFournisseurs.bind(controller)
);

export default categoriesRevenuFournisseurRouter; // Exportation du router renommé
