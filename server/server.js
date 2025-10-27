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

// Allowed frontend origins (add your actual frontend URL(s) here)
const allowedOrigins = [
  "https://witty-island-07d9be700.3.azurestaticapps.net", // your static app
  "http://localhost:5173", // Vite dev server
  
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests (Postman, server-to-server)
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"));
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Apply CORS middleware globally and handle preflight
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/goal", goalRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/dashboard", dashBoardRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/advice", adviceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Serve static files from the 'client/dist' folder if present
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

