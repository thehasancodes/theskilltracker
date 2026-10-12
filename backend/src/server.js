require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const port = Number.parseInt(process.env.PORT || "4000", 10);
const host = process.env.HOST || "127.0.0.1";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  }),
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "theskilltracker-backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use((_request, response) => {
  response.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

if (require.main === module) {
  app.listen(port, host, () => {
    console.log(`Backend listening at http://${host}:${port}`);
  });
}

module.exports = app;
