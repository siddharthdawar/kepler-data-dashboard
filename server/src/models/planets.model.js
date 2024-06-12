const fs = require('fs');
const {parse} = require('csv-parse');
const path = require('path');
const planets = require('./planets.mongo');

const habitablePlanets = [];

const isPlanetHabitable = (planet) =>
    planet.koi_disposition === 'CONFIRMED' &&
    (planet.koi_insol > 0.36 && planet.koi_insol < 1.11) &&
    planet.koi_prad < 1.6;

// this module will export the "planets" array before "fs.createReadStream" has a
// chance to completely parse the data.
// Promise will help block the export before all the data has been parsed
const loadPlanetsData = () =>
    new Promise((resolve, reject) =>
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'cumulative_2024.05.17_12.00.59.csv')) // returns data streams rather than the whole file
            .pipe(parse({
                columns: true, // use column names as object keys
                comment: '#' // treat lines starting with # as comments
            }))
            .on('data', async (row) => { // event listener that gets the data stream
                if (isPlanetHabitable(row)) {
                    /*habitablePlanets.push({
                        keplerName: row.kepler_name
                    });*/ // rows are raw buffers of binary data if parse is not used

                    await savePlanet(row);
                }
            })
            .on('error', (error) => {
                reject(error);
            })
            .on('end', () => {
                resolve();
            }));

const getAllPlanets = async () =>
    // habitablePlanets;
    await planets.find({}, {
        _id: 0,
        keplerName: 1
    });
    // 1 >> include this field, 0 >> exclude the field.
    // Another syntax 'keplerName'. Prefix with '-' to exclude field
    // OR await planets.find({}); (no filter, include all the fields)

const savePlanet = async (planet) => {
    try {
        // 'updateOne' (in this instance with upsert set to true) will create planet if it doesn't exist
        // or will update if it does
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getAllPlanets,
    loadPlanetsData
};
