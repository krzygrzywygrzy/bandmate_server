import express from "express";
import * as dotenv from "dotenv";
import { connect } from "mongoose";
import { Routes, messagesRouter, musicianRouter, userRouter } from "./router";
import { jwtSecretCheck } from "./common/jwt/jwt";

const main = async () => {
  try {
    dotenv.config();
    jwtSecretCheck();

    await connect(process.env.DB_CONNECTION_STRING ?? "");

    const app = express();
    const port = process.env.PORT || 5500;

    app.use(express.json());
    app.use(Routes.USER, userRouter);
    app.use(Routes.MUSICIANS, musicianRouter);
    app.use(Routes.MESSAGES, messagesRouter);

    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

main();
