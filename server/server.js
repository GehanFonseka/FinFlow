const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/db");
const userRoutes = require("./routes/userRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const goalRoutes = require("./routes/goalRoutes");
const walletRoutes = require("./routes/walletRoute");
const dashBoardRoutes = require("./routes/dashBoardRoute");
const reportRoutes = require("./routes/reportRoute");
const adviceRoutes = require("./routes/adviceRoute");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// ===== EARLY PRE-FLIGHT (handles OPTIONS before anything else) =====
app.use((req, res, next) => {
  const origin = req.headers.origin || "";
  // always reflect origin for browser requests so preflight gets Access-Control-Allow-Origin
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,Accept,Origin,X-Requested-With"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    console.log("[PRE-FLIGHT-RESP]", req.originalUrl, "Origin=", origin);
    return res.sendStatus(204);
  }
  next();
});

/* --------------------------- CORS CONFIG --------------------------- */
const allowedOrigins = [
  "https://witty-island-07d9be700.3.azurestaticapps.net", // your frontend
  "http://localhost:5173",
  "http://localhost:3000",
  // you can add other origins here
];

// Use origin: true so CORS middleware reflects the request Origin header
const corsOptions = {
  origin: true, // reflect requester origin => sets Access-Control-Allow-Origin to request origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// small logger to show incoming origin on normal requests too
app.use((req, res, next) => {
  if (req.headers.origin) {
    console.log("[REQ ORIGIN]", req.method, req.originalUrl, "Origin=", req.headers.origin);
  }
  next();
});

app.use(express.json());

/* --------------------------- API ROUTES --------------------------- */
app.use("/api/auth", userRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/goal", goalRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/dashboard", dashBoardRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/advice", adviceRoutes);

/* --------------------------- STATIC FRONTEND --------------------------- */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  });
}

/* --------------------------- ERROR HANDLER --------------------------- */
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]", err);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

/* --------------------------- START SERVER --------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
