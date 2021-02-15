const chai = require('chai');
const chaiHttp = require('chai-http');
const appPromise = require('../src/index');
const dbPromise = require('../src/services/db/db');

let app = null;
let db = null;

const { expect } = chai;
chai.use(chaiHttp);

beforeAll(async () => {
  app = await appPromise;
  db = await dbPromise;
});

const query1 = `
    query {
        ping
    }
    `

const query2 = `
    mutation {
      signIn(input: {
        name: "Alvaro",
        lastname: "Martin",
        email: "alvamasrtsin@gmail.com",
        password: "alva1234"
      }) {
        _id
        name
        lastname
        email
      }
    }
    `  

const query3 = `
    {
      users {
        _id
        name
        lastname
        email
      }
    }
    `

describe('Health', () => {
  it.skip('should validate health check', async () => {
    expect(1).to.equals(1);
    // await checkHealth(false);
  });

  it('should get bricks', async (done) => {
    const res = await chai
        .request(app)
        .post('/')
        .send({ query: query1 })
    expect(res).to.have.status(200);
    expect(res.body.data.ping).to.exist;
    done();
  });

  it('Create new user', async (done) => {
    const res = await chai
        .request(app)
        .post('/')
        .send({ query: query3 })
    expect(res).to.have.status(200);
    expect(res.body).to.exist;
    done();
  });

});

// Viejo

// import chai from 'chai';
// import request from 'supertest';

// const expect = chai.expect;

// describe("GraphQLTest mutation signIn", () => { 
//     it("Prueba", (done) => {
//         request(`http://localhost:3000/`)
//             .post("/")
//             .send(query)
//             .set("Origin", "http://localhost:3000")
//             .set("Host", "localhost:3000")
//             .set("Referer", "http://localhost:3000/")
//             .set("content-type", "application/json")
//             .set("Connection", "keep-alive")
//             .set("Accept", "*/*")
//             .expect("X-Powered-By", "Express")
//             .expect("Connection", "keep-alive")
//             .expect("Access-Control-Allow-Origin", "*")
//             .expect(200)
//             .end((err, res) => {
//                 if (err) return done(err);
//             })
//     })


//     // it("Test add new user to app", (done) => {
//     //     request("http://localhost:3000/")
//     //         .post("/")
//     //         .send(query2)
//     //         .expect(200)
//     //         .end((err, res) => {
//     //             if (err) return done(err);
//     //             console.log(res.body);
//     //             done();
//     //         });
//     // });

// });