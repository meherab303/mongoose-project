/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Application, Request, Response } from "express";
import cors from "cors";

import globalError from "./middleware/globalerror";
import notFound from "./middleware/notFound";
import cookieParser from "cookie-parser";

import router from "./app/routes";

const app: Application = express();

// parser
app.use(express.json());
app.use(express.text());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
// application routes

app.use("/api/v1", router);

const test = async (req: Request, res: Response) => {
  const a = 10;

  await Promise.reject();
  res.send({ a });
};
app.get("/", test);

// global error handler
app.use(globalError);
app.use(notFound);

export default app;
