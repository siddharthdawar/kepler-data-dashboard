const app = require('./app');
const http = require('http');
const {loadPlanetsData} = require('./models/planets.model');

const PORT = process.env.PORT || 8000; // Lets user define a different port at runtime (e.g., "start": "PORT=3000 node src/server.js",)

const server = http.createServer(app);

const startServer = async () => {
    // wait until the csv file has been fully parsed so that planets data is available before listening for requests
    // prevents empty data to be sent in a request's response
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}.`);
    });
};

startServer();
