import type { ErrorRequestHandler } from "express";
//Extend Error Class for Non-existing pages
export class ExpressError extends Error {
  message: string;
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  } 
}
//define errorHandler for app.use
export const errorHandler: ErrorRequestHandler = ((err, req, res, next) => {
  //destructuring ExpressError message & statusCode 
  const { statusCode = 500, message = 'Hata??' } = err;
  //send err message in response render to display on error page.
  res.status(statusCode).render('error', { message, statusCode })
})