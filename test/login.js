const { describe } = require("mocha");
const assert = require("assert");
const { expect } = require("chai");

let token;

describe("Test Login", function () {
  it("Valid Login", async function () {
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/login",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          username: "admin",
          password: "admin",
        }),
      }
    );

    // Assert gaya nodefetch
    assert.strictEqual(response.status, 200);
    
    expect(response.status).to.equal(200); // Gaya notasi Chai

    // Mencetak Response Body
    const data = await response.json();
    console.log(data);
    expect(data.message).to.eql("Login successful");

    // Simpan Token
    token = data.token;
    //console.log(token);
  });

  it("Get User", async function () {
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/users",
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );

    //  assert.strictEqual(response.status, 200);
    expect(response.status).to.equal(200);

    // Mencetak Response Body
    const data = await response.json();
    console.log(data);
  });

  it("Add User", async function () { // positive test case
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/add-user",
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
            username: "Hachiko",
            age: 21
        }),
      }
    );

    //  assert.strictEqual(response.status, 201);
    expect(response.status).to.equal(201);

    // Mencetak Response Body
    const data = await response.json();
    console.log(data);
});

it("Add User", async function () { // negative test case
    const response = await fetch(
      "https://belajar-bareng.onrender.com/api/add-user",
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
            username: "Hachiko",
            age: 21
        }),
      }
    );

    //  assert.strictEqual(response.status, 201);
    expect(response.status).to.equal(400);

    // Mencetak Response Body
    const data = await response.json();
    console.log(data);
});
})
