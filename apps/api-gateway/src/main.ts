/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from "express";
import morgan from "morgan";
import proxy from "express-http-proxy";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { error } from "node:console";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(
  express.json({
    limit: "100mb",
  }),
);

app.use(
  express.urlencoded({
    limit: "100mb",
    extended: true,
  }),
);
app.use(cookieParser());
app.set("trust proxy", 1);

//apply express-rate-limit
//
//
const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req: any) => (req.user ? 1000 : 5),
  message: {
    error: "Too many request, please try again later ",
  },
  keyGenerator: (req: any) => req.ip,
});

app.use(limit);
app.use("/auth", proxy("http://localhost:6001"));

app.get("/gateway-health", (req, res) => {
  res.send({ message: "Welcome to api-gateway!" });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Gateway Listening at http://localhost:${port}/api`);
});
server.on("error", console.error);
