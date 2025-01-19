import { allowedOrigins } from "./allowedOrigins";

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },

  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
