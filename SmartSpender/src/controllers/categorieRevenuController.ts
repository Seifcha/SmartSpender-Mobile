import { NextFunction, Request, Response } from "express";
import { ICategorieRevenuInteractor } from "../interfaces/ICategorieRevenuInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
// import multer from 'multer';
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
@injectable()
export class CategorieRevenuController {
  private interactor: ICategorieRevenuInteractor;

  constructor(
    @inject(INTERFACE_TYPE.CategorieRevenuInteractor)
    interactor: ICategorieRevenuInteractor
  ) {
    this.interactor = interactor;
  }

  async ajouterCategorieRevenu(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new Error("Aucun fichier trouvé dans la requête");
      }

      const image = req.file.buffer.toString("base64");
      const {
        nomCategorie,
        userEmail,
        isPublic,
        possedeFournisseurRevenu,
        IdCategorieFournisseur,
      } = req.body;

      // Convertir la valeur booléenne en entier
      let isPublicInt = 0;
      if (isPublic === "true") {
        isPublicInt = 1;
      } else if (isPublic === "false") {
        isPublicInt = 0;
      }
      let possedeFournisseurRevenuInt = 0;
      if (possedeFournisseurRevenu === "true") {
        possedeFournisseurRevenuInt = 1;
      }

      let insertedCategoryId;
      const interactorResponse = await this.interactor.ajouterCategorieRevenu({
        nomCategorie,
        image,
        possedeFournisseurRevenuInt,
        userEmail,
        isPublicInt,
      });

      insertedCategoryId = interactorResponse.insertedCategoryId;

      // Si possedeFournisseurRevenu est vrai et IdCategorieFournisseur est une chaîne non vide, convertir en tableau et ajouter des entrées dans la table categoriesRevenuFournisseur
      if (
        possedeFournisseurRevenuInt === 1 &&
        IdCategorieFournisseur &&
        IdCategorieFournisseur.trim() !== ""
      ) {
        const categoriesArray = IdCategorieFournisseur.split(",").map(Number);

        await this.interactor.ajouterCategoriesRevenuFournisseur(
          insertedCategoryId,
          categoriesArray
        );
      }

      return res.status(200).json(interactorResponse);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getCategorieRevenus(req: Request, res: Response, next: NextFunction) {
    try {
      // const { id, token } = req.params;

      // const decodedToken = jwt.verify(token, "jwt_secret_key");
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getCategorieRevenus(userEmail);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  async getCategorieRevenu(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.getCategorieRevenu(id);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async modifierCategorieRevenu(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      let image = "";

      // Vérifier si un fichier a été envoyé
      if (req.body.image) {
        image = req.body.image;
        // Si un fichier est envoyé, convertissez le buffer en base64
      } else if (req.file) {
        // Si aucune fichier n'est envoyé mais qu'une image existe déjà dans le corps de la requête, utilisez cette image
        image = req.file.buffer.toString("base64");
      } else {
        // Si ni le fichier ni l'image existante ne sont fournis, lancez une erreur
        throw new Error("Aucun fichier trouvé dans la requête");
      }

      const {
        nomCategorie,
        possedeFournisseurRevenu,
        idCategoriesFournisseurSelected,
        isPublic,
      } = req.body;
      let isPublicInt = 0;
      if (isPublic === "true") {
        isPublicInt = 1;
      } else if (isPublic === "false") {
        isPublicInt = 0;
      }
      // Convertir idCategoriesFournisseurSelected en tableau de nombres
      const idCategoriesFournisseurSelectedArray = JSON.parse(
        idCategoriesFournisseurSelected
      );
      if (
        Array.isArray(idCategoriesFournisseurSelectedArray) &&
        idCategoriesFournisseurSelectedArray.every(
          (element) => typeof element === "number"
        )
      ) {
        // Le contenu est un tableau d'entiers
        console.log(
          "Le contenu est un tableau d'entiers :",
          idCategoriesFournisseurSelectedArray
        );
      } else {
        // Le contenu n'est pas conforme aux attentes
        console.error(
          "Le contenu n'est pas un tableau d'entiers :",
          idCategoriesFournisseurSelectedArray
        );
      }

      // console.log(idCategoriesFournisseurSelectedArray);
      // console.log(typeof idCategoriesFournisseurSelectedArray);
      const possedeFournisseurRevenuInt =
        possedeFournisseurRevenu === "true" ? 1 : 0;

      await this.interactor.modifierCategorieRevenu(
        id,
        nomCategorie,
        image,
        possedeFournisseurRevenuInt,
        idCategoriesFournisseurSelectedArray,
        isPublicInt
      );

      return res
        .status(200)
        .json({ message: "Catégorie de dépense modifiée avec succès" });
    } catch (error) {
      next(error);
    }
  }
  async supprimerCategorieRevenu(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);

      const success = await this.interactor.supprimerCategorieRevenu(id);

      return res.status(200).json({ success });
    } catch (error) {
      next(error);
    }
  }

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
}
