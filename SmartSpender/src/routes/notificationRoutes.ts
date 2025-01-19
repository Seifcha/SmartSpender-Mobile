import express from "express";
import { Container } from "inversify";
import { INotificationRepository } from "../interfaces/INotificationRepository";
import { INTERFACE_TYPE } from "../utils";
import { NotificationRepository } from "../repositories/notificationRepository";
import { INotificationInteractor } from "../interfaces/INotificationInteractor";
import { NotificationInteractor } from "../interactors/notificationInteractor";

import { NotificationController } from "../controllers/notificationController";
import multer from "multer";
import { storage } from "../index";

const upload = multer({
  storage: storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});
const container = new Container();

container
  .bind<INotificationRepository>(INTERFACE_TYPE.NotificationRepository)
  .to(NotificationRepository);

container
  .bind<INotificationInteractor>(INTERFACE_TYPE.NotificationInteractor)
  .to(NotificationInteractor);

container
  .bind<NotificationController>(INTERFACE_TYPE.NotificationController)
  .to(NotificationController);

const notificationRouter = express.Router(); // Renommage de la variable router en notificationRouter

const controller = container.get<NotificationController>(
  INTERFACE_TYPE.NotificationController
);

notificationRouter.get(
  "/notifications/:userEmail",
  controller.getNotifications.bind(controller)
);
notificationRouter.get(
  "/notification/:id",
  controller.getNotification.bind(controller)
);

notificationRouter.put(
  "/notifications/:id",
  controller.modifierVuNotification.bind(controller)
);

export default notificationRouter; // Exportation du router renommé
