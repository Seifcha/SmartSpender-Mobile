import express from "express";
import { Container } from "inversify";
import { IFournisseurRepository } from "../interfaces/IFournisseurRepository";
import { INTERFACE_TYPE } from "../utils";
import { FournisseurRepository } from "../repositories/fournisseurRepository";
import { IFournisseurInteractor } from "../interfaces/IFournisseurInteractor";
import { FournisseurInteractor } from "../interactors/fournisseurInteractor";
import { FournisseurController } from "../controllers/fournisseurController";
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
  .bind<IFournisseurRepository>(INTERFACE_TYPE.FournisseurRepository)
  .to(FournisseurRepository);

container
  .bind<IFournisseurInteractor>(INTERFACE_TYPE.FournisseurInteractor)
  .to(FournisseurInteractor);

container
  .bind<FournisseurController>(INTERFACE_TYPE.FournisseurController)
  .to(FournisseurController);

const router = express.Router();

const controller = container.get<FournisseurController>(
  INTERFACE_TYPE.FournisseurController
);

router.post(
  "/ajouter-fournisseur",
  upload.single("logo"),
  controller.ajouterSuggestionFournisseur.bind(controller)
);

router.get(
  "/fournisseurs/:categorieDepense/:userEmail",
  controller.getFournisseurs.bind(controller)
);
router.get(
  "/fournisseurss/:categorieRevenu/:userEmail",
  controller.getFournisseursss.bind(controller)
);
router.get("/fournisseur/:id", controller.getFournisseur.bind(controller));
router.put(
  "/fournisseurs/:id",
  upload.single("logo"),
  controller.modifierFournisseur.bind(controller)
);
router.delete(
  "/fournisseurs/:id",
  controller.supprimerFournisseur.bind(controller)
);
router.get(
  "/fournisseurs/:userEmail",
  controller.getFournisseurs.bind(controller)
);
router.get(
  "/fournisseurss/:userEmail",
  controller.getFournisseurss.bind(controller)
);

export default router;
