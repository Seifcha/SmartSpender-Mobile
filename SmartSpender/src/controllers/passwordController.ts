import { NextFunction, Request, Response } from "express";
import { IPasswordInteractor } from "../interfaces/IPasswordInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../utils";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

@injectable()
export class PasswordController {
  private interactor: IPasswordInteractor;

  constructor(
    @inject(INTERFACE_TYPE.PasswordInteractor) interactor: IPasswordInteractor
  ) {
    this.interactor = interactor;
  }

  async checkEmailExists(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    console.log(email);
    try {
      const existingUser = await this.interactor.findOne(email);

      if (existingUser) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error("Error checking email existence:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async onForgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    try {
      const user = await this.interactor.findUser(email);

      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      const token = jwt.sign({ id: user.id }, "jwt_secret_key", {
        expiresIn: "1d",
      });
      const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "smartspender.tunisie@gmail.com",
          pass: "ywym vjbr zpkm qvzr",
        },
      });

      const mailOptions = {
        from: "smartspender.tunisie@gmail.com",
        to: email,
        subject: "Réinitialisez votre mot de passe",
        text: "Réinitialisez votre mot de passe",
        html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Réinitialisation de mot de passe</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                }
        
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
        
                td {
                    padding: 10px;
                }
        
                .container {
                    background-color: #f7f7f7;
                    padding: 20px;
                }
        
                .email-wrapper {
                    width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
                }
        
                .content {
                    padding: 40px;
                }
        
                h2 {
                    margin-bottom: 30px;
                }
        
                p.strong {
                    display: inline-block;
                    background-color: #007bff;
                    color: #fff;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 3px;
                }
            </style>
        </head>
        
        <body>
    <table class="container">
        <tr>
            <td>
                <table class="email-wrapper">
                    <tr>
                        <td class="content">
                            <h2>Réinitialisation de mot de passe</h2>
                            <p>Bonjour,</p>
                            <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte <strong>utilisateur</strong> Smart-Spnder. Tapez le code ci-dessous dans l'application pour choisir un nouveau mot de passe :</p>
                            <p style="text-align: center; margin-top: 30px; color: lime; font-size: 24px; font-family: Arial, sans-serif;">
                            <strong>${resetCode}</strong>
                        </p>
                        
                            <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet e-mail. Aucune action supplémentaire n'est requise.</p>
                            <p>Merci,</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
        
        </html>
        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        }
      });

      await this.interactor.saveResetCode(user.id, resetCode);

      return res.send({ Status: "Success", token, id: user.id });
    } catch (error) {
      console.error("Error processing forgot password request:", error);
      return res.status(500).json({ Status: "Error processing request" });
    }
  }

  async validateResetCode(req: Request, res: Response, next: NextFunction) {
    const { id, token } = req.params;
    const { resetCode } = req.body;
    console.log("resetCode", resetCode);

    const idUser = parseInt(id, 10);
    console.log("userId à valider le code", id);
    try {
      const user = await this.interactor.findUserById(idUser);
      console.log(user);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }

      if (user.resetCodeMail === resetCode) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false });
      }
    } catch (error) {
      console.error("Error validating reset code:", error);
      return res.status(500).json({ Status: "Error processing request" });
    }
  }

  async onResetPassword(req: Request, res: Response, next: NextFunction) {
    const { id, token } = req.params;
    const { pwd } = req.body;
    console.log("backend: *******");
    console.log("id:", id);
    console.log("token:", token);
    try {
      const decodedToken = jwt.verify(token, "jwt_secret_key");
      const hashedPwd = await bcrypt.hash(pwd, 10);
      const userId = parseInt(id, 10);
      console.log(userId);
      if (isNaN(userId)) {
        return res.status(400).json({ Status: "Invalid user ID" });
      }

      const data = await this.interactor.resetPassword(userId, hashedPwd);

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ Status: "Error resetting password" });
    }
  }
}
