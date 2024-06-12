const cors = require('cors');
const express = require('express');
const launchesRouter = require('./routes/launches/launches.router');
const morgan = require('morgan');
const path = require('path');
const planetsRouter = require('./routes/planets/planets.router');
// const planetsController = require('./routes/planets/planets.controller');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
})); // use CORS middleware to fix CORS issues
app.use(morgan('short')); // logger (short is the log format)
app.use(express.json());

// To serve the app (frontend in public folder) from the server (localhost@8000) instead of 3000
app.use(express.static(path.join(__dirname, '..', 'public')));

// app.get('/planets', planetsController.getAllPlanets); This statement is the same as "get" in the router.
// Router helps with separation of concerns
app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);
app.get('/*', (req, res) => { // to open the app at localhost:8000 url (root url)
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
