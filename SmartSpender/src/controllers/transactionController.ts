import { NextFunction, Request, Response } from "express";
import { ITransactionInteractor } from "../interfaces/ITransactionInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class TransactionController {
  private interactor: ITransactionInteractor;

  constructor(
    @inject(INTERFACE_TYPE.TransactionInteractor)
    interactor: ITransactionInteractor
  ) {
    this.interactor = interactor;
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      // const { id, token } = req.params;

      // const decodedToken = jwt.verify(token, "jwt_secret_key");
      const id = parseInt(req.params.id);
      const data = await this.interactor.getTransactions(id);
      console.log(data);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getTransactionsRevenu(req: Request, res: Response, next: NextFunction) {
    try {
      // const { id, token } = req.params;

      // const decodedToken = jwt.verify(token, "jwt_secret_key");
      const id = parseInt(req.params.id);
      const data = await this.interactor.getTransactionsRevenu(id);
      console.log(data);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  //   async supprimerTransaction(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const id = parseInt(req.params.id);

  //       const success = await this.interactor.deleteTransaction(id);

  //       return res.status(200).json({ success });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
}
//   async getTransaction(req: Request, res: Response, next: NextFunction) {
//     try {
//       const id = parseInt(req.params.id);
//       const data = await this.interactor.getTransaction(id);

//       return res.status(200).json(data);
//     } catch (error) {
//       next(error);
//     }
//   }

//   async modifierTransaction(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const id = parseInt(req.params.id);
//       let image = "";

//       // Vérifier si un fichier a été envoyé
//       if (req.body.image) {
//         image = req.body.image;
//         // Si un fichier est envoyé, convertissez le buffer en base64
//       } else if (req.file) {
//         // Si aucune fichier n'est envoyé mais qu'une image existe déjà dans le corps de la requête, utilisez cette image
//         image = req.file.buffer.toString("base64");
//       } else {
//         // Si ni le fichier ni l'image existante ne sont fournis, lancez une erreur
//         throw new Error("Aucun fichier trouvé dans la requête");
//       }
//       let possedeFournisseurTransactionInt = 0;

//       const { nom } = req.body;

//       const data = await this.interactor.modifierTransaction(
//         id,
//         nom,
//         image
//       );

//       return res.status(200).json(data);
//     } catch (error) {
//       next(error);
//     }
//   }

// async definirSeuil(req: Request, res: Response, next: NextFunction) {
//   try {
//     const id = parseInt(req.params.id);
//     const seuil = parseInt(req.body.Seuil);

//     const data = await this.interactor.definirSeuil(id, seuil);

//     return res.status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// }
