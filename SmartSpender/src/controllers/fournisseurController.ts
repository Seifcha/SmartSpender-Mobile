import { CategorieDepense } from "./../entities/CategorieDepense";
import { NextFunction, Request, Response } from "express";
import { IFournisseurInteractor } from "../interfaces/IFournisseurInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
import { Fournisseur } from "../entities/Fournisseur";

@injectable()
export class FournisseurController {
  private interactor: IFournisseurInteractor;

  constructor(
    @inject(INTERFACE_TYPE.FournisseurInteractor)
    interactor: IFournisseurInteractor
  ) {
    this.interactor = interactor;
  }

  async ajouterSuggestionFournisseur(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new Error("Aucun fichier trouvé dans la requête");
      }

      const logo = req.file.buffer.toString("base64");
      const { userEmail, nom, mail, phone, isPublic, idCategorieFournisseur } =
        req.body;
      console.log("userEmail ", userEmail);
      // Convertir la valeur booléenne en entier
      let isPublicInt = 0;
      if (isPublic === "true") {
        isPublicInt = 1;
      } else if (isPublic === "false") {
        isPublicInt = 0;
      }
      const data = await this.interactor.ajouterFournisseur({
        userEmail,
        nom,
        mail,
        phone,
        isPublicInt,
        logo,
        idCategorieFournisseur,
      });
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getFournisseurs(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.params.userEmail;
      let categorieDepense = req.params.categorieDepense;
      console.log(typeof categorieDepense);
      // if (categorieDepense !== "null") {
      //   categorieDepense = parseInt(categorieDepense);
      // }
      const data = await this.interactor.getFournisseurs(
        userEmail,
        categorieDepense
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getFournisseursss(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.params.userEmail;
      let categorieRevenu = req.params.categorieRevenu;
      console.log(typeof categorieRevenu);
      // if (categorieDepense !== "null") {
      //   categorieDepense = parseInt(categorieDepense);
      // }
      const data = await this.interactor.getFournisseursss(
        userEmail,
        categorieRevenu
      );
      // console.log("fournisseur asocié", data.idFournisseur);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getFournisseur(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.getFournisseur(id);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async modifierFournisseur(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      let logo = "";
      if (req.file) {
        logo = req.file.buffer.toString("base64");
      } else if (req.body.logo) {
        logo = req.body.logo;
      } else {
        throw new Error("Aucun fichier trouvé dans la requête");
      }

      const { nom, mail, phone, isPublic, idCategorieFournisseur } = req.body;
      let isPublicInt = 0;
      if (isPublic === "true") {
        isPublicInt = 1;
      } else if (isPublic === "false") {
        isPublicInt = 0;
      }
      const data = await this.interactor.modifierFournisseur(
        id,
        nom,
        logo,
        mail,
        phone,
        idCategorieFournisseur,
        isPublicInt
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async supprimerFournisseur(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      const success = await this.interactor.supprimerFournisseur(id);

      return res.status(200).json({ success });
    } catch (error) {
      next(error);
    }
  }
  async getFournisseurss(req: Request, res: Response, next: NextFunction) {
    try {
      // const { id, token } = req.params;

      // const decodedToken = jwt.verify(token, "jwt_secret_key");
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getFournisseurss(userEmail);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
