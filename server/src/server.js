const app = require('./app');
// const cluster = require('cluster'); OR use pm2 package (see package.json)
const mongoServices = require('./services/mongo');
const http = require('http');
const {loadPlanetsData} = require('./models/planets.model');
const {loadSpaceXLaunches} = require('./models/launches.model');
// const os = require('os');

const PORT = process.env.PORT || 8000; // Lets user define a different port at runtime (e.g., "start": "PORT=3000 node src/server.js",)
const server = http.createServer(app);

const startServer = async () => {
    await mongoServices.connectToMongo();

    // wait until the csv file has been fully parsed so that planets data is available before listening for requests
    // prevents empty data to be sent in a request's response
    await loadPlanetsData();
    await loadSpaceXLaunches();

    // if (cluster.isMaster) {
        // cluster.fork();
        // cluster.fork();

        // const CPU_CORES = os.cpus().length;

        /* for (let i = 0; i < CPU_CORES; i++) {
            cluster.fork();
        } */
    // } else {
        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}.`);
        });
    // }
};

startServer();
