import { getActiveSpan } from "@sentry/aws-serverless";
import { pino } from "pino";

export const logger = pino({
  base: {
    environment: process.env.ENV,
  },
  level: process.env.LOG_LEVEL || "info",
  mixin() {
    return {
      traceId: getActiveSpan()?.spanContext().traceId,
    };
  },
});
