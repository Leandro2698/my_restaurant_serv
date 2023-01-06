import { AuthenticationError } from 'apollo-server-errors';
import { verify } from 'jsonwebtoken'
import { config } from '../config/config'


export function getUser(token: string) {
  let payload = null;
   if (token) {
   try {
    payload = verify(token, `${config.SECRET_KEY}`);
    }catch(e:any) { 
      payload=null;
    }
    }
   return payload;
  }