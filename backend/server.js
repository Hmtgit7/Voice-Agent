// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import database
const { sequelize } = require('./models');

// Import routes
const jobRoutes = require('./routes/jobRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const voiceAgentRoutes = require('./routes/voiceAgentRoutes');
const authRoutes = require('./routes/authRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Set static folder (for future frontend integration)
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/voice-agent', voiceAgentRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the Interview Scheduler API',
        version: '1.0.0'
    });
});

// Error handling middleware
app.use(errorHandler);

// Sync database and start server
(async () => {
    try {
        await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('Database synced successfully');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error syncing database:', error);
    }
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    // Close server & exit process
    process.exit(1);
});