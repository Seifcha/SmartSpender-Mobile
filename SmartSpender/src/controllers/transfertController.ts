import { NextFunction, Request, Response } from "express";
import { ITransfertInteractor } from "../interfaces/ITransfertInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class TransfertController {
  private interactor: ITransfertInteractor;

  constructor(
    @inject(INTERFACE_TYPE.TransfertInteractor)
    interactor: ITransfertInteractor
  ) {
    this.interactor = interactor;
  }

  async ajouterTransfert(req: Request, res: Response, next: NextFunction) {
    try {
      let {
        description,
        dateTransfert,
        DeCompte,
        VersCompte,
        montant,
        userEmail,
      } = req.body;

      // Vérifier si le solde est suffisant
      const isSoldeSuffisant = await this.interactor.checkMontant(
        montant,
        DeCompte,
        userEmail
      );
      if (!isSoldeSuffisant) {
        return res.status(400).json({
          message: "Il n'y a pas suffisamment d'argent pour ce transfert.",
        });
      }

      const data = await this.interactor.ajouterTransfert({
        description,
        dateTransfert,
        DeCompte,
        VersCompte,
        montant,
        userEmail,
      });

      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getTransferts(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.params.userEmail;
      const data = await this.interactor.getTransferts(userEmail);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async supprimerTransfert(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      const success = await this.interactor.supprimerTransfert(id);

      return res.status(200).json({ success });
    } catch (error) {
      next(error);
    }
  }

  async getTransfert(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      console.log("id: ", id);
      const data = await this.interactor.getTransfert(id);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  //   async modifierTransfert(
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
  //       let possedeFournisseurTransfertInt = 0;

  //       const { nom } = req.body;

  //       const data = await this.interactor.modifierTransfert(
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
}
