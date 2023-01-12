import  { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import typeDefs  from './graphql/typeDefs/typeDefs';
import resolvers  from './graphql/resolvers/resolvers';
import { EventEmitter } from "events"
 

import { config } from './config/config'
import context from './context';
const PORT = process.env.PORT || 4010;
declare interface AppReady {
  on(event: "ready", listener: () => void): this;
}
class AppReady extends EventEmitter {
emitReady(): void {
  this.emit("ready")
}
}
export const appEvent = new AppReady;
const server =  new ApolloServer  ({
  typeDefs,
  resolvers,
  context: context
});

mongoose
.connect(config.MONGODB,{
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS
}) 
.then( async () => {
  console.log('MongoDB Connected');
  return await server.listen({ port: PORT });  
})  
.then((res) => {   
  console.log(`Server running at ${res.url}`);
  appEvent.emitReady()  
})         
.catch((err) => {                     
  console.error(err);                       
});             

export { server }; 