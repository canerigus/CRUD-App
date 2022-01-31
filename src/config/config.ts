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
