import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logDir = "logs";

// Daily file transport
export const dailyTransport = new DailyRotateFile({
    filename: path.join(logDir, "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
});