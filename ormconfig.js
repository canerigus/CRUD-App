module.exports = {
   type: "mysql",
   host: "localhost",
   port: process.env.DB_PORT,
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   synchronize: true,
   logging: false,
   entities: [
      "src/entity/**/*.ts"
   ]
}