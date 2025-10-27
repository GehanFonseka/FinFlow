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
const path = require('path');

dotenv.config();
connectDB();

const app = express();

/**
 * Manual CORS middleware (explicitly sets headers and responds to preflight).
 * Keeps behavior strict in production — change allowedOrigins for your frontend.
 */
const allowedOrigins = [
  // production frontend
  "https://witty-island-07d9be700.3.azurestaticapps.net",
  // production backend (if called by other services)
  "https://finflow-rg-ea-ehdgehdpd7axchfn.eastasia-01.azurewebsites.net",
  // add local dev origins only if you plan to test from localhost:
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

// --- CORS config (keeps OPTIONS preflight correct) ---
const corsOptions = {
  origin: (origin, callback) => {
    // allow non-browser tools (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  if (req.headers.origin) {
    console.log("[REQ ORIGIN]", req.method, req.originalUrl, "Origin=", req.headers.origin);
  }
  next();
});
// --- end replacement ---

app.use(express.json());

app.use('/api/auth', (req, res, next) => {
  console.log('[AUTH REQUEST]', req.method, req.originalUrl, 'body=', req.body);
  next();
}, userRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/goal", goalRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/dashboard", dashBoardRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/advice", adviceRoutes);

// -- Add this error handler (logs error and returns a safe JSON) --
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]", err);

  const status = err.status || 500;
  const message = err.message || "Server error";

  const errorDetail = {};
  if (process.env.NODE_ENV !== "production") {
    errorDetail.name = err.name;
    errorDetail.message = err.message;
    errorDetail.stack = err.stack;
    Object.getOwnPropertyNames(err).forEach((k) => {
      if (!["name", "message", "stack"].includes(k)) {
        errorDetail[k] = err[k];
      }
    });
  }

  res.status(status).json({ message, error: errorDetail });
});

// Serve static build only in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

