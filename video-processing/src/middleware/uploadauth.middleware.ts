import type { IncomingMessage, ServerResponse } from "http";

import logger from "@/utils/logger";

// TODO: Implement auth logic (from user microservice)
export const onIncomingRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  uploadId: string
) => {
  logger.info("Incoming request", req.method, req.url);
  const token = req.headers.authorization;
  if (!token) {
    throw { status_code: 401, body: "Unauthorized" };
  }
};
