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

// Serve static frontend files (index.html, style.css, script.js)
app.use(express.static(path.join(__dirname)));

// Serve admin static files (admin.css, admin.js)
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API routes
app.use('/api', apiRoutes);

// Admin routes
app.use('/admin', adminRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`\n  🚗 Anterin Server is running!`);
    console.log(`  ───────────────────────────────`);
    console.log(`  📱 App:   http://localhost:${PORT}`);
    console.log(`  🔧 Admin: http://localhost:${PORT}/admin?pw=anterin2026`);
    console.log(`  ───────────────────────────────\n`);
});
