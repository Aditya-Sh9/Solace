import express from "express";
import cors from "cors";
import { env } from "./config/env";

const app = express();

app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "solace-backend" });
});

export default app;
