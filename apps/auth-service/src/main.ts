import express from "express";
import cors from "cors";
import { errorMiddleware } from "../../../packages/error-handler/error-middleware";
import cookieParser from "cookie-parser";
import router from "./routes/auth.routes";
// const swaggerDocument = require("./swagger-output.json")
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
  }),
);

app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});


//routes
// app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument))
// app.get("/doc-json",(req,res)=>{
//   res.json(swaggerDocument)
// })
app.use("/api",router)

app.use(errorMiddleware)

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
  console.log(`Auth Service started at port ${port}`);
});

server.on("error", (err) => {
  console.log("Error from auth service", err);
});
