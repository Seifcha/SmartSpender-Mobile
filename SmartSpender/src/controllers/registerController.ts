import { NextFunction, Request, Response } from "express";
import { IRegisterInteractor } from "../interfaces/IRegisterInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
// import jwt from "jsonwebtoken";

const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
require("dotenv").config();
//
@injectable()
export class RegisterController {
  private interactor: IRegisterInteractor;

  constructor(
    @inject(INTERFACE_TYPE.RegisterInteractor) interactor: IRegisterInteractor
  ) {
    this.interactor = interactor;
  }
  //////////
  async onRegister(req: Request, res: Response, next: NextFunction) {
    const {
      nom,
      prenom,
      genre,
      dateNaissance,
      adresse,
      phone,
      domaineTravail,
      posteTravail,
      userEmail,
      mdp,
    } = req.body;
    console.log(userEmail);
    let email = userEmail;
    let password = mdp;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "email and password are required." });
    // validate logic
    const duplicate = await this.interactor.findByEmail(email);
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
      if (!req.file) {
        throw new Error("Aucun fichier trouvé dans la requête");
      }
      const photoProfil = req.file.buffer.toString("base64");

      const hashedPwd = await bcrypt.hash(password, 10);
      console.log("gbal requete register");
      const newUser = await this.interactor.register({
        photoProfil,
        nom,
        prenom,
        genre,
        dateNaissance,
        adresse,
        phone,
        domaineTravail,
        posteTravail,
        email,
        hashedPwd,
      });
      console.log("ba3d requete register");

      // create JWTs
      //   const accessToken = jwt.sign(
      //     { username: newUser.username },
      //     process.env.ACCESS_TOKEN_SECRET,
      //     { expiresIn: "15s" }
      //   );
      //   const refreshToken = jwt.sign(
      //     { username: newUser.username },
      //     process.env.REFRESH_TOKEN_SECRET,
      //     { expiresIn: "1d" }
      //   );
      //   //encrypt the password

      //   //store the new user
      //   await this.interactor2.saveToken(user, refreshToken);

      res.status(201);
      //   res.cookie("jwt", refreshToken, {
      //     httpOnly: true,
      //     maxAge: 24 * 60 * 60 * 1000,
      //   });
      //   res.json({ success: `New user ${user} created!`, accessToken });
      res.json({ success: `New user ${newUser.prenom} created!` });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  } //

  async modifierProfil(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.params.userEmail;
      let photoProfil = "";

      // Vérifier si un fichier a été envoyé
      if (req.body.photoProfil) {
        photoProfil = req.body.photoProfil;
        // Si un fichier est envoyé, convertissez le buffer en base64
      } else if (req.file) {
        // Si aucune fichier n'est envoyé mais qu'une image existe déjà dans le corps de la requête, utilisez cette image
        photoProfil = req.file.buffer.toString("base64");
      } else {
        // Si ni le fichier ni l'image existante ne sont fournis, lancez une erreur
        throw new Error("Aucun fichier trouvé dans la requête");
      }

      const { nom, prenom, adresse, phone, domaineTravail, posteTravail } =
        req.body;

      const data = await this.interactor.modifierProfil(
        nom,
        prenom,
        adresse,
        phone,
        domaineTravail,
        posteTravail,
        userEmail,
        photoProfil
      );

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userEmail = req.params.userEmail; // Assurez-vous que ceci correspond au paramètre dans l'URL
      console.log("userEmail", userEmail);
      const data = await this.interactor.getUser(userEmail);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
//   async getImage(req: Request, res: Response, next: NextFunction) {
//     try {
//       const username = req.params.username;
//       const data = await this.interactor.getImage(username);
//       return res.status(200).json(data);
//     } catch (error) {
//       next(error);
//     }
//   }//
