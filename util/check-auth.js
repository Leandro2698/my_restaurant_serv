const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Verify if the autorization of the header is correct and verify
 * if the token of the user is correct.
 * @param {[Object]} User argument for passing e authentication scope for all resolver might need
 * @returns user.
 */
module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader;
    if (token) {
      try {
        const user = jwt.verify(token, `${process.env.JWT_SECRET}`);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error('Authentication token must be [token]');
  }
  throw new Error('Autheorization header must be provider');
};
