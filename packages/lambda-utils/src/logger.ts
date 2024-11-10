import { pino } from "pino";

export const logger = pino({
  base: {
    environment: process.env.ENV,
  },
});
