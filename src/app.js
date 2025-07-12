import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./constant.js";
import { authRoute } from "./routes/auth.routes.js";
import { propertiesRoute } from "./routes/property.routes.js";
import { bookMarkRoute } from "./routes/bookMark.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/auth", authRoute);
app.use("/api/properties", propertiesRoute);
app.use("/api/bookmark", bookMarkRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || "Something went wrong",
  });
});

export default app;
