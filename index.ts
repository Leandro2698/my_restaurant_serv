import  { ApolloServer } from 'apollo-server';
import { format } from 'date-fns';
import mongoose from 'mongoose';
// const test = require('./test');

// test();
const typeDefs = require('./graphql/typeDefs/typeDefs');
const resolvers = require('./graphql/resolvers/resolvers');

const { MONGODB } = require('./config/config');

const PORT = process.env.port || 4004;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});
  
mongoose
  .connect(MONGODB) 
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
                                         