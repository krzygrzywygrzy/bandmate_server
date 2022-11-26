import express from "express";
import { config as dotenv } from "dotenv";
import { connect } from "mongoose";
import { Routes, musicianRouter } from "./router";

const main = async () => {
  try {
    dotenv();

    await connect(process.env.DB_CONNECTION_STRING ?? "");

    const app = express();
    const port = process.env.PORT || 5500;

    app.use(express.json());
    app.use(Routes.MUSICIANS, musicianRouter);

    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

main();
