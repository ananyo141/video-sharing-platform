import dotenv from "dotenv";
import fs from "fs";

import logger from "@utils/logger";

const envPath = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV.toLowerCase()}`
  : ".env";

if (!fs.existsSync(envPath)) {
  logger.warn(process.env.NODE_ENV);
  logger.warn(`No .env file found at ${envPath}`);
}

dotenv.config({
  path: envPath,
});

interface EnvType {
  MINIO_ENDPOINT: string;
  MINIO_PORT: string;
  MINIO_SSL: string;
  MINIO_ACCESS_KEY: string;
  MINIO_SECRET_KEY: string;
  MINIO_BUCKET: string;
  PORT: string;
}

const env: EnvType = {
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT as string,
  MINIO_PORT: process.env.MINIO_PORT as string,
  MINIO_SSL: process.env.MINIO_SSL as string,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY as string,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY as string,
  MINIO_BUCKET: process.env.MINIO_BUCKET as string,
  PORT: process.env.PORT as string,
};

if (Object.values(env).includes(undefined)) {
  logger.error(
    `Some environment variables are missing, given env: ${JSON.stringify(env, null, 2)}`,
  );
  process.exit(1);
}

export default env;
