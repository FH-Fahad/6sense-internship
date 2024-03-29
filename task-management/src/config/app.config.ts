import * as dotenv from 'dotenv';
dotenv.config();

export interface EnvironmentVariables {
  PORT: number;
  TYPE: string;
  HOST: string;
  DB_PORT: number;
  USER_NAME: string;
  PASSWORD: string;
  DATABASE: string;
  JWT_SECRET_KEY: string;
}

const env: EnvironmentVariables = {
  PORT: parseInt(process.env.PORT),
  TYPE: process.env.TYPE,
  HOST: process.env.HOST,
  DB_PORT: parseInt(process.env.DB_PORT),
  USER_NAME: process.env.USER_NAME,
  PASSWORD: process.env.PASSWORD,
  DATABASE: process.env.DATABASE,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};

export default env;
