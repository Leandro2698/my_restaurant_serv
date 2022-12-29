import Restaurant from './models/Restaurant'
import User from './models/User'
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { config } from 'dotenv';
import { format } from 'date-fns';
import { Restaurant as TypeRestaurant } from './types';
import request from 'supertest';

import  { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import typeDefs  from './graphql/typeDefs/typeDefs';
import resolvers  from './graphql/resolvers/resolvers';

import { config as myConfig } from './config/config'
const PORT = process.env.PORT || 4010;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

// const date:Date = new Date('2022-02-02')
// Date.now = () => Math.floor(new Date('2022.02.02').getTime() )

function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}


const mongoUri = process.env.MONGO_URI  

const registerUser = `mutation RegisterUser($registerInput: RegisterInput!) {
  registerUser(registerInput: $registerInput) {
    id
    token
  }
}`
const loginUser = `mutation LoginUser($loginInput: LoginInput) {
  loginUser(loginInput: $loginInput) {
    id
    token
  }
}`

const createRestaurantMut = `mutation CreateRestaurant($createRestaurantInput: CreateRestaurant!) {
  createRestaurant(createRestaurantInput: $createRestaurantInput) {
    _id
    name
  }
}`
const createProductMut = `mutation CreateProduct($restaurantId: ID!, $createProductInput: CreateProduct!) {
  createProduct(restaurantId: $restaurantId, createProductInput: $createProductInput) {
    _id
    name
    products {
      id 
      name
    }
  }
}`
const createSaleMut = `mutation SoldProduct($restaurantId: ID!, $productId: ID!, $soldProductInput: SoldProduct!) {
  soldProduct(restaurantId: $restaurantId, productId: $productId, soldProductInput: $soldProductInput) {
    _id
  }
}`

const email = "lolu@gmail.com"; 
const password = "lolu"; 

async function fixtures() {
  await Restaurant.deleteOne({name:"restoFixture"})
  await User.deleteOne({email: email})
  const response = await request("localhost:4010").post('/graphql').send(
    {
        query: registerUser,
        variables: {
          "registerInput": {
            "firstname": "lolu",
            "lastname": "lolu",
            "email": email,
            "password": password,
            "confirmPassword": "lolu"
          }
        }
      }
  );
  const createRestaurantResponse = await request("localhost:4010").post('/graphql')
  .set('Authorization', response.body.data.registerUser.token)
  .send(
    {
      query: createRestaurantMut,
        variables: {
          "createRestaurantInput": {
            "name": "restoFixture"
          }
        }
      }
  );
  const createProductResponse = await request("localhost:4010").post('/graphql')
  .set('Authorization', response.body.data.registerUser.token)
  .send(
    {
      query: createProductMut,
        variables: {
          "restaurantId": createRestaurantResponse.body.data.createRestaurant._id,
          "createProductInput": {
            "category": "drink",
            "name": "productFixture",
            "unitSalePrice": 10
          }
        } 
      }
  );
  // console.log(`res`,createProductResponse.body.data.createProduct.products[0])
  for(let i = 1 ; i <= 12; i += 1) {
    const month = i < 10 ? `0${i}` : `${i}`;
    console.log(`month`, month)
    Date.now = () => Math.floor(new Date(`2022.${month}.02`).getTime() )

    const loginResponse = await request("localhost:4010").post('/graphql')
    .send(
      {
        query: loginUser,
        variables: {
          "loginInput": {
            "email": email,
            "password": password
          }
        }
      }
      );
      console.log(`createSaleResponse`, loginResponse.body)
      const createSaleResponse = await request("localhost:4010").post('/graphql')
      .set('Authorization', loginResponse.body.data.loginUser.token)
      .send(
        {
          query: createSaleMut,
          variables: {
            "restaurantId": createRestaurantResponse.body.data.createRestaurant._id,
            "productId": createProductResponse.body.data.createProduct.products[0].id,
            "soldProductInput": {
              "unitProductSold": getRandomInt(30)
            }
          }
        }
        );
        console.log(`createSaleResponse`, createSaleResponse.body)
      }
  }

if(!mongoUri){
throw('error mongo uri')
}
mongoose
  .connect(myConfig.MONGODB,{
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS
  }) 
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });  
  })  
  .then(async (res) => {   
    console.log(`Server running at ${res.url}`);  
    await fixtures()
    await server.stop()
    await mongoose.disconnect()

  })         
  .catch((err) => {                     
    console.error(err);                       
  });                               
