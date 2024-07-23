import express, {
  ErrorRequestHandler,
  Express,
  NextFunction,
  Request,
  Response,
} from "express";
import authRoutes from "./routes/auth";
import mongoose from "mongoose";
import "dotenv/config";
import apiv1 from "./routes/api/v1";
import authorizeUser from "./middlewares/auth/authorization";
import account from "./routes/api/account";
import fs from "fs";
const cookieParser = require("cookie-parser");
const https = require("https");
const cors = require("cors");
const app: Express = express();
const uri = process.env.MONGODB_URI as string;
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

mongoose.set("strictQuery", false);
async function startMongooseServer(uri: string): Promise<void> {
  await mongoose.connect(uri);
}
startMongooseServer(uri)
  .then((data) => console.log("Database Connected"))
  .catch((err) => console.log(err));

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://192.168.1.71:5173", "http://localhost:5173"],
  }),
);
app.use(express.json());
app.use(express.urlencoded());

https.createServer(options, app).listen({ port: 8080 }, () => {
  console.log(`Server running on https://localhost:${8080}`);
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("Hello Re:read API");
});
app.use("/auth", authRoutes);
app.use("/account", account);
app.use("/api/v1", authorizeUser, apiv1);
//app.use("/app", apiv1);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // improve error handling
  console.log("Error name: " + err.name);
  console.log("Error handler: " + err.message);
  if (err.name === "JsonWebTokenError") {
    res.json({
      tokenInvalid: true,
      message: "Invalid Token",
      redirect: { canNavigate: true, route: "/auth/login" },
    });
  } else if (err.name === "TokenExpiredError") {
    res.json({
      sessionExpired: true,
      message: "Session Expired",
      redirect: { canNavigate: true, route: "/auth/login" },
    });
  } else if (err.name === "UserQueryError") {
    res.json({
      userQueryError: true,
      message: err.message,
      redirect: { canNavigate: true, route: "/auth/username" },
    });
  } else if (err.name === "UserUpdateError") {
    res.json({
      ErrorMessage: err.message,
    });
  } else {
    res.json({ ErrorMessage: err.message });
  }
});
