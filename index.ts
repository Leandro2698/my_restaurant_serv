import  { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import typeDefs  from './graphql/typeDefs/typeDefs';
import resolvers  from './graphql/resolvers/resolvers';

import { config } from './config/config'
const PORT = process.env.port || 4009;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});
  
mongoose
  .connect(config.MONGODB) 
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });  
  })  
  .then((res) => {   
    console.log(`Server running at ${res.url}`);  
  })         
  .catch((err) => {                     
    console.error(err);                       
  });                               
  console.log(`confconfig`,config) 