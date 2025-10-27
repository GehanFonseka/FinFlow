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

dotenv.config();
connectDB();

const app = express();

const express = require("express");
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://witty-island-07d9be700.3.azurestaticapps.net" // your Azure frontend
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"));
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};



// Handle preflight OPTIONS requests globally
app.options("*", cors(corsOptions));

// Apply CORS to all routes
app.use(cors(corsOptions));

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

const path = require('path');



// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, 'client/dist')));

// Redirect all other routes to React's index.html
app.get('*', (req, res) => {

  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

