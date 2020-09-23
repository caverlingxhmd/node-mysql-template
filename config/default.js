'use strict';

module.exports = {
  port: parseInt(process.env.PORT, 10) || 8001,
  dbOptions: {
    username: "root",
    password: "root",
    database: "test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  session: {
    name: 'SID',
    secret: 'SID',
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    }
  }
}