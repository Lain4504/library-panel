const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const routes = require('./routes');
const specs = require('./config/swagger');

// Config dotenv
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Connect to database
connectDB();

// Routes
app.use('/api', routes);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});