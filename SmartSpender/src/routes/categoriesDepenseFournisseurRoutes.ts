import express from "express";
import { Container } from "inversify";
import { ICategorieDepenseFournisseurRepository } from "../interfaces/ICategorieDepenseFournisseurRepository";
import { INTERFACE_TYPE } from "../utils";
import { CategorieDepenseFournisseurRepository } from "../repositories/categoriesDepenseFournisseurRepository";
import { ICategorieDepenseFournisseurInteractor } from "../interfaces/ICategorieDepenseFournisseurInteractor";
import { CategorieDepenseFournisseurInteractor } from "../interactors/categoriesDepenseFournisseurInteractor";

import { CategorieDepenseFournisseurController } from "../controllers/categoriesDepenseFournisseurController";
import multer from "multer";
import { storage } from "../index";

const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});
const container = new Container();

container
  .bind<ICategorieDepenseFournisseurRepository>(
    INTERFACE_TYPE.CategorieDepenseFournisseurRepository
  )
  .to(CategorieDepenseFournisseurRepository);

container
  .bind<ICategorieDepenseFournisseurInteractor>(
    INTERFACE_TYPE.CategorieDepenseFournisseurInteractor
  )
  .to(CategorieDepenseFournisseurInteractor);

container
  .bind<CategorieDepenseFournisseurController>(
    INTERFACE_TYPE.CategorieDepenseFournisseurController
  )
  .to(CategorieDepenseFournisseurController);

const categoriesDepenseFournisseurRouter = express.Router(); // Renommage de la variable router en categorieDepenseRouter

const controller = container.get<CategorieDepenseFournisseurController>(
  INTERFACE_TYPE.CategorieDepenseFournisseurController
);

categoriesDepenseFournisseurRouter.get(
  "/categories-depense-fournisseur/:id",
  controller.getCategorieDepenseFournisseurs.bind(controller)
);

export default categoriesDepenseFournisseurRouter; // Exportation du router renommé
