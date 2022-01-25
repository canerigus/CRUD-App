import { createConnection } from "typeorm"
import { Request } from "express"
//typeorm database connection fn. initiated in app.ts
export const connectDatabase = async () => {
  try {
    await createConnection();
    console.log('Database connected')
  } catch (err) {
    console.log(err)
    console.log('Something went wrong while connecting to Database!')
  }
}

//extend Request for authentication
/* export interface IRequest extends Request {
  user: {
    username: string,
    iat: number,
    exp: number
  }
} */

//cookie options
export const sessionOptions = {
  resave: true,
  saveUninitialized: true,
  secret: 'notagoodsecret',
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 5 * 60),
    maxAge: 1000 * 5 * 60
  }
}


//to declare additional properties on session object using [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).
//commented out. @types express-session 1.17.0 doesnt error type check on when adding req.session.xxx. later version needs the below code.
/* declare module 'express-session' {
  interface SessionData {
      username: string;
  }
}
export { }; */
