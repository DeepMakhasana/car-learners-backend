const express = require("express");
const app = express();
const authRoute = require("./auth/auth.route.js");
const errorHandler = require("./middlewares/errorHandler.js");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ message: "running.." });
});

// routes
app.use("/api/v1/auth", authRoute);

// Use the error handler
app.use(errorHandler);

module.exports = app;
