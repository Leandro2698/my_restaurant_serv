import { getUser } from "./util/verifyToken";

export default ({ req, res }:any) => {
  if(req.headers.authorization){
    const userLogged = getUser(req.headers.authorization);
    console.log(`userLogged-context`, userLogged)
    return {
      req,
      res,
      userLogged,
    };
  }
  }