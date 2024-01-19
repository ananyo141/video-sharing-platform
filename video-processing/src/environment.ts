import dotenv from "dotenv";
import fs from "fs";

import logger from "@utils/logger";

const envPath = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV.toLowerCase()}`
  : ".env";

if (!fs.existsSync(envPath)) {
  logger.warn(process.env.NODE_ENV)
  logger.warn(`No .env file found at ${envPath}`)
}

dotenv.config({
  path: envPath,
});

interface EnvType {
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  PORT: string;
}

const env: EnvType = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  PORT: process.env.PORT ?? "8001",
};

if (Object.values(env).includes(undefined)) {
  logger.error("Some environment variables are missing");
  process.exit(1);
}

export default env;
