const express = require("express");

const cors = require("cors");

const patientRoutes = require("./routes/patientRoutes");
const vitalRoutes = require("./routes/vitalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const predictionRoutes = require("./routes/predictionRoutes");

const alertRoutes = require("./routes/alertRoutes");

const aiSummaryRoutes = require("./routes/aiSummaryRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);

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

app.use("/api/vitals", vitalRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/predictions", predictionRoutes);

app.use("/api/alerts", alertRoutes);

app.use("/api/ai", aiSummaryRoutes);

app.use(errorHandler);

module.exports = app;
