const express = require('express');
const path = require('path');
const cors = require('cors');

const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// VERCEL FIX: Explicitly serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin static files
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API routes
app.use('/api', apiRoutes);

// Admin routes
app.use('/admin', adminRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`\n  🚗 Anterin Server is running!`);
});

module.exports = app;