const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should sign up a new user", async () => {
  const userTwo = {
    name: "Anna",
    email: "anna.guscina@gmail.com",
    password: "Jiggly2182",
  };
  const response = await request(app).post("/users").send(userTwo).expect(201);
  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);

  expect(user).not.toBeNull();
  // Assertions about the response (should at least match properties provided. Extra ones won't be count)
  expect(response.body).toMatchObject({
    user: {
      name: userTwo.name,
      email: userTwo.email,
    },
    token: user.tokens[0].token,
  });
  // Assert that plain text password not stored in DB
  expect(user.password).not.toBe(userTwo.password);
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  // Assert that new token added to tokens list
  const user = await User.findById(userOneId);
  const addedToken = user.tokens[1].token;

  expect(response.body.token).toBe(addedToken);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "nonexistinguser@email.com",
      password: "nonexistinguserpassword",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").expect(401);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").expect(401);
});

test("Should upload avatar", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  const newName = "Ivan";
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: newName })
    .expect(200);

  expect(response.body.name).toBe(newName);
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ fatherName: "Mikhailovich" })
    .expect(400);
});
