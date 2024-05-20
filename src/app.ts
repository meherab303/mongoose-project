import express, { Application, Request, Response } from "express";
import cors from "cors";
import { StudentRoutes } from "./modules/student/student.route";

const app: Application = express();

// parser
app.use(express.json());
app.use(express.text());
app.use(cors());
// application routes
app.use("/api/v1/student", StudentRoutes);

app.get("/", (req: Request, res: Response) => {
  const a = 10;

  res.send(a);
});

export default app;
