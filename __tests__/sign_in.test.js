const { assert } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const appPromise = require('../src/index');
const dbPromise = require('../src/services/db/db');

// CONFIGS

let app = null;
let db = null;

const { expect } = chai;
chai.use(chaiHttp);

beforeAll(async () => {
  app = await appPromise;
  db = await dbPromise;
});

const name = "Alvaro";
const lastname = "Martin";
const email = "alvaro.martin1307@gmail.com";
const password = "alva1234";

const query1 = `
    mutation {
      signIn(input: {
        name: "Alvaro",
        lastname: "Martin",
        email: "alvaro.martin1307@gmail.com",
        password: "alva1234"
      }) {
        _id
        name
        lastname
        email
      }
    }
    `  

const query2 = `
    mutation {
      signIn(input: {
        name: "Aldana",
        lastname: "Martin",
        email: "aldimartin@gmail.com",
        password: "aldi1234"
      }) {
        _id
        name
        lastname
        email
      }
    }
    `

// TESTS

describe('GraphQLTest mutation signIn',  () => {
  it('Create new user and return _id', async (done) => {
    const res = await chai
        .request(app)
        .post('/')
        .send({query: query1});
    
    expect(res).to.have.status(200);
    expect(res.body.data.signIn).to.exist;
    assert(res.body.data.signIn._id != null, "Id is not null");
    assert(res.body.data.signIn.name === name, "Property name is Alvaro" + name);
    assert(res.body.data.signIn.lastname === lastname, "Property lastname is " + lastname);
    assert(res.body.data.signIn.email === email, "Property email is " + email);
    
    done();
  });

  // it('Create user with existing email is invalid', async (done) => {
  //   const res = await chai
  //       .request(app)
  //       .post('/')
  //       .send({query: query1});
    
  //   expect(res).to.have.status(200);
  //   assert(res.body.data === null, "Field signIn is null");
  //   expect(res.body.errors).to.exist;
  //   console.log(res.body.data);
    
  //   done();
  // });
});