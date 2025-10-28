const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/db");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const goalRoutes = require("./routes/goalRoutes");
const walletRoutes = require("./routes/walletRoute");
const dashBoardRoutes = require("./routes/dashBoardRoute");
const reportRoutes = require("./routes/reportRoute");
const adviceRoutes = require("./routes/adviceRoute");

dotenv.config();
connectDB();

const app = express();

/* --------------------------- CORS CONFIG --------------------------- */
const allowedOrigins = [
  "https://witty-island-07d9be700.3.azurestaticapps.net", // frontend
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("Blocked CORS request from:", origin);
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
  })
);

// handle preflight requests properly
app.options("*", cors());

app.use(express.json());

/* --------------------------- ROUTES --------------------------- */
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
  const clientBuildPath = path.join(__dirname, "client/dist");
  app.use(express.static(clientBuildPath));

  // fallback for React router
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

/* --------------------------- ERROR HANDLER --------------------------- */
app.use((err, req, res, next) => {
  console.error("[SERVER ERROR]", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

/* --------------------------- SERVER --------------------------- */
const PORT = process.env.PORT || 5000; // ✅ use Azure-assigned port
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
