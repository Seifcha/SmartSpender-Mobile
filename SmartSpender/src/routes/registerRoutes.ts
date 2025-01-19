import express from "express";
import { Container } from "inversify";
import { IRegisterRepository } from "../interfaces/IRegisterRepository";
import { INTERFACE_TYPE } from "../utils";
import { RegisterRepository } from "../repositories/registerRepository";
import { IRegisterInteractor } from "../interfaces/IRegisterInteractor";
import { RegisterInteractor } from "../interactors/registerInteractor";
import { RegisterController } from "../controllers/registerController";

import multer from "multer";
import { storage } from "../index";

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000 * 1024 * 1024, // Set file size limit to 10MB (adjust as needed)
  },
});
const container = new Container();

container
  .bind<IRegisterRepository>(INTERFACE_TYPE.RegisterRepository)
  .to(RegisterRepository);

container
  .bind<IRegisterInteractor>(INTERFACE_TYPE.RegisterInteractor)
  .to(RegisterInteractor);

container.bind(INTERFACE_TYPE.RegisterController).to(RegisterController);

const router = express.Router();

const controller = container.get<RegisterController>(
  INTERFACE_TYPE.RegisterController
);

router.post(
  "/register",
  upload.single("photo"),
  controller.onRegister.bind(controller)
);
router.put(
  "/user/:userEmail",
  upload.single("photoProfil"),
  controller.modifierProfil.bind(controller)
);
router.get("/user/:userEmail", controller.getUser.bind(controller));

// router.get("/register/:username", controller.getImage.bind(controller));

export default router;
