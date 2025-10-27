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
  // production frontend (static app)
  "https://witty-island-07d9be700.3.azurestaticapps.net",
  // production backend (if you call backend from other services / same origin)
  "https://finflow-rg-ea-ehdgehdpd7axchfn.eastasia-01.azurewebsites.net",
  // local dev
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000"
];

// --- add corsOptions definition (was missing) ---
const corsOptions = {
  origin: function (origin, callback) {
    // allow non-browser tools (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 204
};
// --- end added block ---

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Expose-Headers", "Authorization");

  if (req.method === "OPTIONS") {
    // Short-circuit preflight
    return res.sendStatus(204);
  }
  next();
});

// Apply CORS globally using the configured options
app.use(cors(corsOptions));

// Log and short-circuit OPTIONS preflight before other handlers to avoid 404
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
  res.header('Access-Control-Allow-Credentials', 'true');
  // Allow preflight to be cached
  res.header('Access-Control-Max-Age', '600');
  // short-circuit
  return res.sendStatus(204);
});

// Optional debug: log incoming origins for troubleshooting
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('[CORS] Preflight:', req.method, req.originalUrl, 'Origin=', req.headers.origin);
  }
  next();
});
// (cors middleware already applied above and OPTIONS handled) -- no duplicate application

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

