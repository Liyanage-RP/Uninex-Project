const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const connectDB = require('./config/db');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const adminRoutes = require('./routes/adminRoutes');
const listingRoutes = require('./routes/listingRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
});
app.use('/api', limiter);

// Standard Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://uninexus.com'
        : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
}));
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'UniNexus API is running successfully!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/events', eventRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error' 
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
