const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactions');
require('dotenv').config();

const app = express();

// Middleware: Allows your app to handle JSON and cross-origin requests
app.use(express.json());
app.use(cors());
app.use('/api/transactions', transactionRoutes);

// Database Connection: Connecting to the local engine you just started
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🚀 MongoDB Connected! ComradeWallet is ready."))
    .catch(err => console.error("Database connection error:", err));

// A simple 'Test' route (Like a URL pattern in Django)
app.get('/', (req, res) => {
    res.send("ComradeWallet API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/auth', require('./routes/auth'));