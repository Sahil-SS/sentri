const express = require("express");

const cors = require("cors");

const patientRoutes = require("./routes/patientRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.get("/", (req, res) => {
  res.json({
    message: "Sentri Node Backend Running",
  });
});

app.use("/api/patients", patientRoutes);

app.use(errorHandler);

module.exports = app;
