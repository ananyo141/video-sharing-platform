import { Queue } from "bullmq";

import env from "@/environment";

const queue = new Queue(env.JOB_QUEUE_NAME, {
  connection: {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT),
  },
});

export default queue;
