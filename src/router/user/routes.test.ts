import * as jwt from "../../common/jwt";
import * as bcrypt from "bcrypt";
import { CommonErrors } from "../types";
import { AuthErrors, UserRoutes } from "./types";
import { dbConnect, dbDisconnect, musiciansMock } from "../../test_utils";
import request from "supertest";
import { userRouter } from "./routes";
import express from "express";
import { Musician } from "../../mongo/schemas";

const authHeader = { Authorization: "Bearer token" };

const mockedTocken = "TOKEN";
jest.mock("../../common/jwt");
const mockedJwt = jwt as jest.Mocked<typeof jwt>;
mockedJwt.sign.mockReturnValue(mockedTocken);

jest.mock("bcrypt");
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("user router", () => {
  const app = express();
  app.use(express.json());
  app.use("/", userRouter);

  beforeAll(async () => {
    await dbConnect();

    await Musician.insertMany(musiciansMock);
  });

  afterAll(async () => {
    await dbDisconnect();
  });

  describe("GET /you", () => {
    it("should return your data", async () => {
      const expectedUser = musiciansMock[0];
      mockedJwt.decode.mockReturnValue({ _id: expectedUser._id });

      const {
        body: { you },
      } = await request(app).get(UserRoutes.YOU).set(authHeader);

      expect(you.name).toEqual(expectedUser.name);
      expect(you.contact).toEqual(expectedUser.contact);
      expect(you.about).toEqual(expectedUser.about);
    });

    it("should throw 401 error when user is not logged in", async () => {
      var response = await request(app).get(UserRoutes.YOU);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ error: CommonErrors.UNAUTHENTICATED });
    });
  });

  describe("POST /login", () => {
    it("should propery login user", async () => {
      const expectedUser = musiciansMock[0];

      //create mocks
      mockedBcrypt.compare.mockImplementationOnce(() => Promise.resolve(true));

      //perform request
      const {
        statusCode,
        body: { token, musician },
      } = await request(app).post(UserRoutes.LOGIN).send({
        email: expectedUser.contact.email,
        password: expectedUser.password,
      });

      expect(statusCode).toBe(200);

      expect(token).toBe(mockedTocken);
      expect(musician.name).toEqual(expectedUser.name);
      expect(musician.about).toEqual(expectedUser.about);
      expect(musician.contact.email).toEqual(expectedUser.contact.email);
    });

    it("should throw error when user is not found", async () => {
      const response = await request(app).post(UserRoutes.LOGIN).send({
        email: "dummy email",
        password: "dummy password",
      });

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ error: AuthErrors.USER_NOT_FOUND });
    });

    it("should throw error when password is wrong", async () => {
      const expectedUser = musiciansMock[0];

      mockedBcrypt.compare.mockImplementationOnce(() => Promise.resolve(false));

      //perform request
      const response = await request(app).post(UserRoutes.LOGIN).send({
        email: expectedUser.contact.email,
        password: "dummy password",
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ error: AuthErrors.WRONG_PASSWORD });
    });
  });

  describe("POST /register", () => {
    const musicianToRegister = {
      name: {
        firstName: "Jan",
      },
      contact: {
        email: "newuser@wp.pl",
      },
      about: {
        instruments: ["guitar", "voice"],
        genres: ["metal", "rock"],
        description: "Sample description",
      },
      password: "Kwakwa5!",
    };

    it("should properly register new musician", async () => {
      const hash = jest.spyOn(bcrypt, "hash");

      const {
        statusCode,
        body: { token, musician },
      } = await request(app).post(UserRoutes.REGISTER).send(musicianToRegister);

      expect(hash).toBeCalledTimes(1);
      expect(statusCode).toBe(201);
      expect(token).toBe(mockedTocken);
      expect(musician.name).toEqual(musicianToRegister.name);
      expect(musician.about).toEqual(musicianToRegister.about);
      expect(musician.contact).toEqual(musicianToRegister.contact);
    });

    it("should throw bad request error when body is wrong", async () => {
      const { statusCode, body } = await request(app)
        .post(UserRoutes.REGISTER)
        .send({});

      expect(statusCode).toBe(400);
      expect(body).toEqual({ error: CommonErrors.BAD_REQUEST });
    });

    it("should throw error when email is already used", async () => {
      const { statusCode, body } = await request(app)
        .post(UserRoutes.REGISTER)
        .send({ ...musicianToRegister, contact: musiciansMock[0].contact });

      expect(statusCode).toEqual(400);
      expect(body).toEqual({ error: CommonErrors.ITEM_ALREADY_EXISTS });
    });

    it("should throw error when password is to weak", async () => {
      const { statusCode, body } = await request(app)
        .post(UserRoutes.REGISTER)
        .send({ ...musicianToRegister, password: "dummypassword" });

      expect(statusCode).toEqual(400);
      expect(body).toEqual({ error: AuthErrors.PASSWORD_TO_WEAK });
    });
  });
});
