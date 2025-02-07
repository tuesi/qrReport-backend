const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require("http");
const { Server } = require("socket.io");
const loadRoutes = require('./util/routeLoader');
const databaseChangeListener = require('./socket/changeListenter');

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    },
    transports: ["websocket"]
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//Database change listener
databaseChangeListener(io);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//Load routes from routes folder
loadRoutes(app);

//ngrok http 5000