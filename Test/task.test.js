let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

//assertion style
chai.should();
chai.use(chaiHttp);

describe("Tasks API", () => {
  // test the GET route

  describe("GET /api/services/allqueries", () => {
    it("it should get all the tasks", async () => {
      const response = await chai
        .request(server)
        .get("/api/services/allqueries");
      response.should.have.status(200);
      response.body.should.be.a("array");
      //   response.body.length.should.be.eq(4);
    }).timeout(10000);
  });

  describe("GET /api/services/allTransactions", () => {
    it("it should get all the tasks", async () => {
      const response = await chai
        .request(server)
        .get("/api/services/allTransactions");
      response.should.have.status(200);
      response.body.should.be.a("array");
      //   response.body.length.should.be.eq(4);
    });
  });

  describe("GET /api/services/prescriptioncheck", () => {
    it("it should get all the tasks", async () => {
      const response = await chai
        .request(server)
        .get("/api/services/prescriptioncheck");
      response.should.have.status(200);
      response.body.should.be.a("array");
      //   response.body.length.should.be.eq(4);
    });
  });

  // test the get (by id) route
  describe("GET /api/users/:id", () => {
    it("should create a new product", async () => {
      const response = await chai
        .request(server)
        .get(`/api/users/${"644436eb6d377028622a35e1"}`);
      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.property("username", "sriram");
      response.body.should.have.property("email", "navaneethsai.h20@iiits.in");
      response.body.should.have.property("usertype", "Consumer");
    });
  });

  describe("POST /api/products/:id", () => {
    it("should create a new product", async () => {
      const response = await chai
        .request(server)
        .post(`/api/products/${"644369d3ad38ccc830a698b1"}`);
      response.should.have.status(200);
      response.body.should.be.a("object");
      response.body.should.have.property("productname", "Inlife Diabetes Care");
      response.body.should.have.property("price", "129");
      response.body.should.have.property("category", "prescribe");
    });
  });
});
