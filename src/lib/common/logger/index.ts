import winston from "winston";
import { dailyTransport } from "./transports";

// Format for log entries
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
        ({ timestamp, level, message }) =>
            `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
);

// Winston logger instance
export const logger = winston.createLogger({
    level: process.env.ENVIRONMENT === "production" ? "info" : "debug",
    format: logFormat,
    transports: [
        new winston.transports.Console(), // always log to console
        dailyTransport, // also log to file
    ],
});
