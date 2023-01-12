import { verify } from 'jsonwebtoken'
import { config } from '../config/config'


export function getUser(token: string) {
  console.log(`token --> getUser`, token)
  let payload = null;
   if (token) {
   try {
    payload = verify(token, `${config.SECRET_KEY}`);
    }catch(e:any) {
      console.log(`e --> getUser`, e) 
      payload=null;
    }
    }
   return payload;
  }