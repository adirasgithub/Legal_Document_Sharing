const express = require('express');
const dotenv = require('dotenv');
const uploadRoutes = require('./routes/uploadsRoutes');
const shareRoutes = require('./routes/shareRoutes');
const cors = require('cors'); 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000',  // Allow only the React app
  credentials: true                 // Allow cookies, authorization headers, etc.
}));

// Middleware for parsing JSON bodies
app.use(express.json());

// Routes
app.use('/api', uploadRoutes);
app.use('/api', shareRoutes);
// app.use('/api', getstatusRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
