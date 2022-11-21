/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationError }  from 'apollo-server';
import { verify } from 'jsonwebtoken'

 
import { config } from '../config/config'

/**
 * Verify if the autorization of the header is correct and verify
 * if the token of the user is correct.
 * @param {[Object]} User argument for passing e authentication scope for all resolver might need
 * @returns user.
 */
export default (context:any) => { 
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader;
    if (token) {
      try {
        const user:any = verify(token, `${config.SECRET_KEY}`);
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }
    throw new Error('Authentication token must be [token]'); 
  }
  throw new Error('Autheorization header must be provider');
};
