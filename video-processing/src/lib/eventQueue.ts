import amqp from "amqplib";

import jobQueue from "./jobQueue";

export async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(
      "amqp://guest:guest@events-queue:5672",
    );
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    return { connection, channel };
  } catch (err) {
    console.warn(err);
    throw err;
  }
}

export async function listenQueue(
  queueName: string,
  exchangeName: string,
  routingKey: string,
): Promise<void> {
  try {
    const { connection, channel } = await connectToRabbitMQ();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    // Declare the exchange
    await channel.assertExchange(exchangeName, "direct", { durable: true });
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
          jobQueue.add("upload", { message });
          console.log(`Received message: ${message}`);
        }
      },
      { noAck: true },
    ); // Set noAck to false if you want to manually acknowledge messages

    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (err) {
    console.warn(err);
  }
}
