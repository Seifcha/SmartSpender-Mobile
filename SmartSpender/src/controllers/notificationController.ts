import { NextFunction, Request, Response } from "express";
import { INotificationInteractor } from "../interfaces/INotificationInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
import { Title } from "chart.js";
// import multer from 'multer';

@injectable()
export class NotificationController {
  private interactor: INotificationInteractor;

  constructor(
    @inject(INTERFACE_TYPE.NotificationInteractor)
    interactor: INotificationInteractor
  ) {
    this.interactor = interactor;
  }

  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      // const { id, token } = req.params;

      // const decodedToken = jwt.verify(token, "jwt_secret_key");
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getNotifications(userEmail);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.getNotification(id);
      console.log("chouf hedhi mara o5ra: ", data);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async modifierVuNotification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);

      const data = await this.interactor.modifierVuNotification(id);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
//   async ajouterNotification(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       if (!req.file) {
//         throw new Error("Aucun fichier trouvé dans la requête");
//       }

//       const image = req.file.buffer.toString("base64");
//       const {
//         nomCategorie,
//         userEmail,
//         isPublic,
//         possedeFournisseurDepense,
//         IdCategorieFournisseur,
//       } = req.body;

//       // Convertir la valeur booléenne en entier
//       let isPublicInt = 0;
//       if (isPublic === "true") {
//         isPublicInt = 1;
//       } else if (isPublic === "false") {
//         isPublicInt = 0;
//       }
//       let possedeFournisseurDepenseInt = 0;
//       if (possedeFournisseurDepense === "true") {
//         possedeFournisseurDepenseInt = 1;
//       }

//       let insertedCategoryId;
//       const interactorResponse = await this.interactor.ajouterNotification({
//         nomCategorie,
//         image,
//         possedeFournisseurDepenseInt,
//         userEmail,
//         isPublicInt,
//       });

//       insertedCategoryId = interactorResponse.insertedCategoryId;

//       // Si possedeFournisseurDepense est vrai et IdCategorieFournisseur est une chaîne non vide, convertir en tableau et ajouter des entrées dans la table categoriesDepenseFournisseur
//       if (
//         possedeFournisseurDepenseInt === 1 &&
//         IdCategorieFournisseur &&
//         IdCategorieFournisseur.trim() !== ""
//       ) {
//         const categoriesArray = IdCategorieFournisseur.split(",").map(Number);

//         await this.interactor.ajouterCategoriesDepenseFournisseur(
//           insertedCategoryId,
//           categoriesArray
//         );
//       }

//       return res.status(200).json(interactorResponse);
//     } catch (error) {
//       console.log(error);
//       next(error);
//     }
//   }
