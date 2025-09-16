// Main server file
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Routes
// Import routes here when they are created
app.use('/api/usuarios', require('./src/routes/usuariosRoutes'));
// app.use('/api/goats', require('./src/routes/goatsRoutes'));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// API health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Goat Project API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Frontend available at: http://localhost:${PORT}`);
    console.log(`API available at: http://localhost:${PORT}/api`);
});

module.exports = app;