// Importez le tableau allowedOrigins
import { allowedOrigins } from "../config/allowedOrigins";

const credentials = (req, res, next) => {
  // Assurez-vous que allowedOrigins est un tableau

  res.header("Access-Control-Allow-Credentials", true);
  next();
};

module.exports = credentials;
