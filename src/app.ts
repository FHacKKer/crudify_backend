import express from "express";
import logger from "./middleware/logger";
import authRouter from "./routes/auth-routes";
const app = express();

app.use(express.json());

app.use(logger);

app.use("/api/v1/auth", authRouter);

export default app;
