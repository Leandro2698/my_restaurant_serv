import mongoose from 'mongoose';
import  { appEvent, server } from '../index';
import request from 'supertest';
import User from '../models/User';
import Restaurant from '../models/Restaurant';


afterAll(async () => {
  await mongoose.disconnect()
  await server.stop()
})

it('should wait the app be ready', done => {
 appEvent.on("ready", () => done())
})


const userTest = {
  firstname: "test",
  lastname: "test",
  email: "test@gmail.com",
  password: "test",
  confirmPassword: "test",
}

const registerUser = `mutation RegisterUser($registerInput: RegisterInput!) {
  registerUser(registerInput: $registerInput) {
    id
    token
    restaurants {
      _id
    }
  }
}`
const createRestaurant = `mutation CreateRestaurant($createRestaurantInput: CreateRestaurant!) {
  createRestaurant(createRestaurantInput: $createRestaurantInput) {
    _id
    name
    admin {
      id
    } 
  }
}`
const createProduct = `mutation CreateProduct($restaurantId: ID!, $createProductInput: CreateProduct!) {
  createProduct(restaurantId: $restaurantId, createProductInput: $createProductInput) {
    _id
    name
    products {
      id
      name
    }
  }
}`
it('should not register the user', async () => {
  await User.deleteOne({email: userTest.email })
  const responseRegisterUser = await request("localhost:4010").post('/graphql').send(
    {
        query: registerUser,
        variables: {
          "registerInput": {
            "firstname": userTest.firstname,
            "lastname": userTest.lastname,
            "email": userTest.email,
            "password": "",
            "confirmPassword": userTest.confirmPassword,
          }
        }
      }
  );
  expect({responseRegisterUser}).toBeTruthy();
  expect(responseRegisterUser.body.errors).toBeDefined();
})
it('should create an user and restaurant for add one product to his restaurant', async () => {
  await User.deleteOne({email: userTest.email })
  await Restaurant.deleteMany({name: "restoTest" })
  const responseRegisterUser = await request("localhost:4010").post('/graphql').send(
    {
        query: registerUser,
        variables: {
          "registerInput": {
            "firstname": userTest.firstname,
            "lastname": userTest.lastname,
            "email": userTest.email,
            "password": userTest.password,
            "confirmPassword": userTest.confirmPassword,
          }
        }
      }
  );
  expect(responseRegisterUser.body.errors).toBeUndefined();
  const createRestaurantResponse = await request("localhost:4010").post('/graphql')
  .set('Authorization', responseRegisterUser.body.data.registerUser.token)
  .send(
    {
      query: createRestaurant,
        variables: {
          "createRestaurantInput": {
            "name": "restoTest"
          }
        }
      }
  );
  expect(createRestaurantResponse.body.errors).toBeUndefined();
  expect(responseRegisterUser.body.data.registerUser.id).toEqual(createRestaurantResponse.body.data.createRestaurant.admin.id);

  const createProductResponse = await request("localhost:4010").post('/graphql')
  .set('Authorization', responseRegisterUser.body.data.registerUser.token)
  .send(
    {
      query: createProduct,
        variables: {
          "restaurantId": createRestaurantResponse.body.data.createRestaurant._id,
          "createProductInput": {
            "name": "productTest",
            "category": "drink",
            "unitSalePrice": 10
          }
        } 
      }
  );
  expect(createProductResponse.body.errors).toBeUndefined();
  await User.deleteOne({email: userTest.email })
  await Restaurant.deleteMany({name: "restoTest" })
});              
  