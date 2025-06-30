import { config } from 'dotenv';

import { IDatabaseConfig } from './core/interfaces/dbConfig.interface';

config();

export const databaseConfig: IDatabaseConfig = Object.freeze({
  local: {
    username: process.env.DB_USER_LOCAL,
    password: process.env.DB_PASSWORD_LOCAL,
    database: process.env.DB_NAME_LOCAL,
    host: process.env.DB_HOST_LOCAL,
    port: process.env.DB_PORT_LOCAL,
    dialect: process.env.DB_DIALECT_LOCAL,
    frontEndBaseUrl: process.env.FRONTEND_FORGET_URL_LOCAL,
    ssl: false,
  },
  development: {
    username: process.env.DB_USER_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    port: process.env.DB_PORT_DEV,
    dialect: process.env.DB_DIALECT_DEV,
    frontEndBaseUrl: process.env.FRONTEND_FORGET_URL_DEV
  },
  staging: {
    username: process.env.DB_USER_STAGING,
    password: process.env.DB_PASSWORD_STAGING,
    database: process.env.DB_NAME_STAGING,
    host: process.env.DB_HOST_STAGING,
    port: process.env.DB_PORT_STAGING,
    dialect: process.env.DB_DIALECT_STAGING,
    frontEndBaseUrl: process.env.FRONTEND_FORGET_URL_STAGING
  },
  production: {
    username: process.env.DB_USER_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    port: process.env.DB_PORT_DEV,
    dialect: process.env.DB_DIALECT_DEV,
    frontEndBaseUrl: process.env.FRONTEND_FORGET_URL_DEV
    // username: process.env.DB_USER_PROD,
    // password: process.env.DB_PASSWORD_PROD,
    // database: process.env.DB_NAME_PROD,
    // host: process.env.DB_HOST_PROD,
    // port: process.env.DB_PORT_PROD,
    // dialect: process.env.DB_DIALECT_PROD,
    // frontEndBaseUrl: process.env.FRONTEND_FORGET_URL_PROD
  }
});

const env = process.env.NODE_ENV || 'development';
export const DBconfig = databaseConfig[env];