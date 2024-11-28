const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();
app.use(express.json());
app.use(cors());
require("dotenv").config();

app.use("/api/v1/ath", authRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
async function dbConnect() {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("dbConnected");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}

dbConnect();

