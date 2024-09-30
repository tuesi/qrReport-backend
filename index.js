const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const deviceRoutes = require('./routes/devices');
const reportRoutes = require('./routes/reports');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api', deviceRoutes);
app.use('/api', reportRoutes);

//ngrok http 5000