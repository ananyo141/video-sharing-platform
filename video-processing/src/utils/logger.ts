import winston from "winston";

const { combine, timestamp } = winston.format;

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}] - ${message}`;
});

const logger = winston.createLogger({
  silent: process.env.NODE_ENV === "test",
  level: process.env.LOG_LEVEL ?? "http",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    customFormat,
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
