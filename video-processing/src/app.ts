import compression from "compression";
import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import cors from "cors";
import express, { Express } from "express";
import morgan from "morgan";

import logger from "@utils/logger";
import env from "./environment";
import { errorHandler } from "@/middleware/errorhandler.middleware";
import { routeNotFound } from "@/middleware/notfound.middleware";
import { onUploadFinish } from "@/middleware/upload.middleware";

const port = env.PORT;
const app: Express = express();
const tusServer = new Server({
  datastore: new FileStore({
    directory: "./uploads",
  }),
  path: "/uploads",
  onUploadFinish,
});

function initMiddleware(): void {
  app.use(compression());
  app.use(express.json({ limit: "500kb" }));
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("[:date[web]] :method :url :status :response-time ms"));
}

function initRouter(): void {
  app.use("/uploads", tusServer.handle.bind(tusServer));
  app.use(routeNotFound); // fallback route
  app.use(errorHandler); // error handler
}

function initServer(): void {
  app.listen(port, () => {
    logger.info(`Server started In ENV: ${JSON.stringify(env, null, 2)}`);
    logger.info(`Server is running at http://localhost:${port}`);
  });
  app.on("error", onError);
}

export async function init(): Promise<void> {
  try {
    logger.info("init");
    initMiddleware();
    initRouter();
    initServer();
  } catch (err: any) {
    logger.error("Unable to initialize app: ", err.message);
    logger.error(err);
  }
}

/*
 * Event listener for HTTP server "error" event.
 */

function onError(error: any): void {
  if (error.syscall !== "listen") {
    throw error;
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const bind = typeof port === "string" ? "Pipe " + port : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}
