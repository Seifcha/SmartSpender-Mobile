import "reflect-metadata";

import categorieDepenseRouter from "./routes/categorieDepenseRoutes";
import categorieRevenuRouter from "./routes/categorieRevenuRoutes";
import sousCategorieDepenseRouter from "./routes/sousCategorieDepenseRoutes";
import categorieFournisseurRouter from "./routes/categorieFournisseurRoutes";
import authRouter from "./routes/authRoutes";
import categoriesDepenseFournisseurRouter from "./routes/categoriesDepenseFournisseurRoutes";

import registerRouter from "./routes/registerRoutes";
import fournisseurRouter from "./routes/fournisseurRoutes";

import multer from "multer";
import path from "path";
import seuilRouter from "./routes/seuilRoutes";
import compteRouter from "./routes/compteRoutes";
import carteRouter from "./routes/carteRoutes";
import depenseRouter from "./routes/depenseRoutes";
import revenuRouter from "./routes/revenuRoutes";
import transactionRouter from "./routes/transactionRoutes";
import transfertRouter from "./routes/transfertRoutes";
import dashboardRouter from "./routes/dashboardRoutes";
import passwordRouter from "./routes/passwordRoutes";
import notificationRouter from "./routes/notificationRoutes";

import categoriesRevenuFournisseurRouter from "./routes/categorieRevenuFournisseurRoutes";

const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
// const cookieParser = require("cookie-parser");
const credentials = require("./middleWare/credentials");
const PORT = process.env.PORT || 9001;

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
// app.use(cookieParser());

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
app.use(registerRouter);
app.use(authRouter);

app.use(fournisseurRouter);
app.use(categorieDepenseRouter);
app.use(sousCategorieDepenseRouter);
app.use(categorieRevenuRouter);
app.use(seuilRouter);
app.use(compteRouter);
app.use(carteRouter);
app.use(carteRouter);
app.use(categorieFournisseurRouter);
app.use(depenseRouter);
app.use(revenuRouter);
app.use(transactionRouter);
app.use(transfertRouter);

app.use(categoriesDepenseFournisseurRouter);
app.use(categoriesRevenuFournisseurRouter);
app.use(passwordRouter);
app.use(dashboardRouter);
app.use(notificationRouter);

app.listen(PORT, () => {
  console.log("Listening to: ", PORT);
});
