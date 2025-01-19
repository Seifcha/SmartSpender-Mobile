import { NextFunction, Request, Response } from "express";
import { ISousCategorieDepenseInteractor } from "../interfaces/ISousCategorieDepenseInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
import { SousCategorieDepense } from "../entities/SousCategorieDepense";

@injectable()
export class SousCategorieDepenseController {
  private interactor: ISousCategorieDepenseInteractor;

  constructor(
    @inject(INTERFACE_TYPE.SousCategorieDepenseInteractor)
    interactor: ISousCategorieDepenseInteractor
  ) {
    this.interactor = interactor;
  }

  async ajouterSousCategorie(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new Error("Aucun fichier trouvé dans la requête");
      }

      const image = req.file.buffer.toString("base64");
      const { nomSousCategorie, idCategorieDepense, userEmail, isPublic } =
        req.body;

      let isPublicInt = 0;
      if (isPublic === "true") {
        isPublicInt = 1;
      } else if (isPublic === "false") {
        isPublicInt = 0;
      }
      // Ajouter la sous-catégorie de dépense en utilisant l'interactor
      const data = await this.interactor.ajouterSousCategorieDepense({
        nomSousCategorie,
        image,
        idCategorieDepense,
        userEmail,
        isPublicInt,
      });

      // Retourner les données ajoutées avec le code de statut 200 (OK)
      return res.status(200).json(data);
    } catch (error) {
      // Passer l'erreur au gestionnaire d'erreurs suivant
      next(error);
    }
  }

  async getSousCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.params.userEmail;
      const idCategorieParente = parseInt(req.params.id);
      const data = await this.interactor.getSousCategoriesDepenses(
        userEmail,
        idCategorieParente
      );
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getSousCategorie(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const data = await this.interactor.getSousCategorie(id);
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async modifierSousCategorie(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      let image = "";

      // Vérifier si un fichier a été envoyé
      if (req.file) {
        // Si un fichier est envoyé, convertissez le buffer en base64
        image = req.file.buffer.toString("base64");
      } else if (req.body.image) {
        // Si aucune fichier n'est envoyé mais qu'une image existe déjà dans le corps de la requête, utilisez cette image
        image = req.body.image;
      } else {
        // Si ni le fichier ni l'image existante ne sont fournis, lancez une erreur
        throw new Error("Aucun fichier trouvé dans la requête");
      }
      const { nomSousCategorie, isPublic } = req.body;
      console.log(isPublic);
      console.log(typeof isPublic);

      // Modifier la sous-catégorie de dépense en utilisant l'interactor
      const data = await this.interactor.modifierSousCategorieDepense(
        id,
        nomSousCategorie,
        image,
        isPublic
      );

      // Retourner les données modifiées avec le code de statut 200 (OK)
      return res.status(200).json(data);
    } catch (error) {
      // Passer l'erreur au gestionnaire d'erreurs suivant
      next(error);
    }
  }

  async supprimerSousCategorie(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);

      // Supprimer la sous-catégorie de dépense en utilisant l'interactor
      const success = await this.interactor.supprimerSousCategorieDepense(id);

      // Retourner le résultat de la suppression avec le code de statut 200 (OK)
      return res.status(200).json({ success });
    } catch (error) {
      // Passer l'erreur au gestionnaire d'erreurs suivant
      next(error);
    }
  }

  //   async definirSeuil(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const id = parseInt(req.params.id);
  //       const seuil = parseFloat(req.body.seuil);

  //       // Définir le seuil de la sous-catégorie de dépense en utilisant l'interactor
  //       const data = await this.interactor.definirSeuil(id, seuil);

  //       // Retourner les données mises à jour avec le code de statut 200 (OK)
  //       return res.status(200).json(data);
  //     } catch (error) {
  //       // Passer l'erreur au gestionnaire d'erreurs suivant
  //       next(error);
  //     }
  //   }
  // }
}
