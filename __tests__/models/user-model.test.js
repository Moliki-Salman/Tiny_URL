const User = require("../../models/user-model");
const connectToDB = require("../../config/connect");
const { connections } = require("mongoose");

let mongod;

describe("User", () => {
  describe("validations", () => {
    beforeAll(async () => {
      connections.map(async (a) => await a.dropDatabase())
      mongod = connectToDB()
    });

    afterAll(async () => {
      connections.map(async (a) => {
        await a.close()
        await a.dropDatabase()
      })
    });

    it("is invalid without an email, password firstname, and lastname", async () => {
      const user = new User({});

      await expect(user.validate()).rejects.toThrow(
        "User validation failed: password: Path `password` is required., email: Path `email` is required., lastname: Path `lastname` is required., firstname: Path `firstname` is required."
      );
    });

    it("is valid when all inputs are provided", async () => {
      const user = new User({
        firstname: "Yusuf",
        lastname: "Daniju",
        password: "password",
        email: "danijuyusuf@gmail.com",
      });

      await expect(user.validate()).resolves.not.toThrow();
    });

    it("makes the email lowercase", async () => {
      const user = new User({
        firstname: "Yusuf",
        lastname: "Daniju",
        password: "password",
        email: "DANIJU@gmail.com",
      });
      await user.save();

      await expect(user.email).toEqual("daniju@gmail.com");
    });
  });
});
