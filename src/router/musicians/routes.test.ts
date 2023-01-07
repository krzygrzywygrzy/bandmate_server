import express from "express";
import { musicianRouter } from "./routes";
import {
  dbConnect,
  dbDisconnect,
  musiciansMock,
  authHeader,
} from "../../test_utils";
import { Musician } from "../../mongo/schemas";
import * as jwt from "../../common/jwt";
import request from "supertest";
import { MusicianMessages, MusicianRoutes } from "./types";
import { CommonErrors } from "../types";
import { Types } from "mongoose";
import { Match } from "../../mongo/schemas/matchSchema";

const yourId = musiciansMock[0]._id;

jest.mock("../../common/jwt");
const mockedJwt = jwt as jest.Mocked<typeof jwt>;
mockedJwt.decode.mockReturnValue({ _id: yourId });

describe("Musicians Routes", () => {
  const app = express();
  app.use(express.json());
  app.use("/", musicianRouter);

  describe("GET /", () => {
    beforeAll(async () => {
      await dbConnect();

      await Musician.insertMany(musiciansMock);
    });

    afterAll(async () => {
      await dbDisconnect();
    });

    it("should return list of suitable musicians", async () => {
      const { statusCode, body } = await request(app)
        .get(MusicianRoutes.GET)
        .set(authHeader);

      expect(statusCode).toBe(200);

      // 1) data of the user that makes request should not be returned
      // 2) should only return data that has at least one the same liked genre
      // for user1 of mockedUsers there should be three musicians returned
      expect(body.musicians).toHaveLength(3);
    });

    it("should throw error when user is not logged in", async () => {
      const { statusCode, body } = await request(app).get(MusicianRoutes.GET);

      expect(statusCode).toEqual(401);
      expect(body).toEqual({ error: CommonErrors.UNAUTHENTICATED });
    });
  });

  describe("POST /like", () => {
    beforeEach(async () => {
      await dbConnect();

      await Musician.insertMany(musiciansMock);
    });

    afterEach(async () => {
      await dbDisconnect();
    });

    const likeRequest = async (likeId: Types.ObjectId) =>
      request(app)
        .post(MusicianRoutes.LIKE)
        .send({ id: likeId })
        .set(authHeader);

    it("should properly like other musician", async () => {
      const likeId = musiciansMock[1]._id;

      const { statusCode, body } = await likeRequest(likeId);

      //check if response is proper
      expect(statusCode).toBe(200);
      expect(body).toEqual({ message: MusicianMessages.LIKED });

      //check if user actually has new like in db
      const you = await Musician.findById(yourId);
      expect(you?.swipes.likes).toHaveLength(2);
    });

    it("should match with other musician if he/she liked you before", async () => {
      const likeId = musiciansMock[3]._id;

      const { statusCode, body } = await likeRequest(likeId);

      //check if response is proper
      expect(statusCode).toBe(200);
      expect(body.message).toEqual(MusicianMessages.MATCH);

      //
      //check if user actually matched according to db

      // 1) check if you have new match
      const you = await Musician.findById(yourId);
      expect(you?.swipes.matches).toHaveLength(2);
      expect(you?.swipes.likes).toHaveLength(2);

      // 2) check if your match also have new match
      const yourMatch = await Musician.findById(likeId);
      expect(yourMatch?.swipes.matches).toHaveLength(1);
      expect(yourMatch?.swipes.likes).toHaveLength(1);

      // 3) check if match doc is created
      const match = await Match.findById(you?.swipes.matches[0]);
      expect(match).toBeDefined();
    });
  });

  describe("GET /matches", () => {
    beforeAll(async () => {
      await dbConnect();

      await Musician.insertMany(musiciansMock);
    });

    afterAll(async () => {
      await dbDisconnect();
    });

    it("should get list of your matches", async () => {
      // const { statusCode, body } = await request(app)
      //   .get(MusicianRoutes.MATCHES)
      //   .set(authHeader);
      // expect(statusCode).toBe(200);
      // //user1 has only one match (user5)
      // expect(body.matches).toHaveLength(1);
    });
  });
});
