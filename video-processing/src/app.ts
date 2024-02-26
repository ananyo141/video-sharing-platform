import compression from "compression";
import amqp from "amqplib";
import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import cors from "cors";
import express, { Express } from "express";
import fs from "fs";
import morgan from "morgan";

import logger from "@utils/logger";
import env from "./environment";
import { errorHandler } from "@/middleware/errorhandler.middleware";
import { routeNotFound } from "@/middleware/notfound.middleware";
import { onUploadFinish } from "@/middleware/uploadvideo.middleware";
import { onIncomingRequest } from "@/middleware/uploadauth.middleware";
import { initBucket } from "./lib/uploadBucket";

// Create upload folder if doesn't exist
if (!fs.existsSync(env.UPLOAD_FOLDER)) {
  fs.mkdirSync(env.UPLOAD_FOLDER);
}

const port = env.PORT;
const app: Express = express();
const tusServer = new Server({
  datastore: new FileStore({
    directory: "./" + env.UPLOAD_FOLDER,
  }),
  path: "/video/uploads",
  onIncomingRequest,
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
  app.use("/video/uploads", tusServer.handle.bind(tusServer));
  app.use(routeNotFound); // fallback route
  app.use(errorHandler); // error handler
}

function initServer(): void {
  app.listen(port, () => {
    logger.info(`Server started In ENV: ${JSON.stringify(env, null, 2)}`);
    logger.info(`Server is running.`);
  });
  app.on("error", onError);
}

async function listenQueue(): Promise<void> {
  const queueName = "minio";
  const exchangeName = "uploadevents"; // Replace with your exchange name
  const routingKey = "uploadlogs"; // Replace with your routing key

  (async () => {
    try {
      const connection = await amqp.connect(
        "amqp://guest:guest@events-queue:5672",
      );
      const channel = await connection.createChannel();

      process.once("SIGINT", async () => {
        await channel.close();
        await connection.close();
      });

      // Declare the exchange
      await channel.assertExchange(exchangeName, "fanout", { durable: true });
      const assertQueueResponse = await channel.assertQueue(queueName, {
        durable: true,
      });

      await channel.bindQueue(
        assertQueueResponse.queue,
        exchangeName,
        routingKey,
      );
      console.log(
        `Waiting for messages from exchange: ${exchangeName} with routing key: ${routingKey}`,
      );

      channel.consume(
        assertQueueResponse.queue,
        (msg) => {
          if (msg?.content) {
            const message = msg.content.toString();
            console.log(`Received message: ${message}`);
          }
        },
        { noAck: true },
      ); // Set noAck to false if you want to manually acknowledge messages

      console.log(" [*] Waiting for messages. To exit press CTRL+C");
    } catch (err) {
      console.warn(err);
    }
  })();
}

export async function init(): Promise<void> {
  try {
    logger.info("init");
    initBucket();
    initMiddleware();
    initRouter();
    initServer();
    listenQueue();
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
      logger.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      logger.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}
