const { AuthenticationError } = require('apollo-server');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

module.exports = (context) => {

  const authHeader = context.req.headers.authorization;
  if(authHeader){
    const token = authHeader
    if(token){
      try {
        const user = jwt.verify(token,`${process.env.JWT_SECRET}` )
        return user
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error('Authentication token must be [token]');
  }
  throw new Error('Autheorization header must be provider');
}