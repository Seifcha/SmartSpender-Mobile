import express from "express";
import { Container } from "inversify";
import { ITransactionRepository } from "../interfaces/ITransactionRepository";
import { INTERFACE_TYPE } from "../utils";
import { TransactionRepository } from "../repositories/transactionRepository";
import { ITransactionInteractor } from "../interfaces/ITransactionInteractor";
import { TransactionInteractor } from "../interactors/transactionInteractor";

import { TransactionController } from "../controllers/transactionController";

const container = new Container();

container
  .bind<ITransactionRepository>(INTERFACE_TYPE.TransactionRepository)
  .to(TransactionRepository);

container
  .bind<ITransactionInteractor>(INTERFACE_TYPE.TransactionInteractor)
  .to(TransactionInteractor);

container
  .bind<TransactionController>(INTERFACE_TYPE.TransactionController)
  .to(TransactionController);

const TransactionRouter = express.Router(); // Renommage de la variable router en TransactionRouter

const controller = container.get<TransactionController>(
  INTERFACE_TYPE.TransactionController
);

// TransactionRouter.post(
//   "/transaction",
//   controller.ajouterTransaction.bind(controller)
// );

TransactionRouter.get(
  "/transactions/:id",
  controller.getTransactions.bind(controller)
);
TransactionRouter.get(
  "/transactionss/:id",
  controller.getTransactionsRevenu.bind(controller)
);
// TransactionRouter.get("/-transaction/:id", controller.getTransaction.bind(controller));

// TransactionRouter.put(
//   "/s-transactions/:id",
//   upload.single("image"),
//   controller.modifierTransaction.bind(controller)
// );
// TransactionRouter.delete(
//   "/transaction/:id",
//   controller.supprimerTransaction.bind(controller)
// );
// TransactionRouter.patch("/s-transactions/:id/valider", controller.validerTransaction.bind(controller));

export default TransactionRouter; // Exportation du router renommé
