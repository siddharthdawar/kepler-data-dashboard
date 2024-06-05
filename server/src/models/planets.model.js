const fs = require('fs');
const {parse} = require('csv-parse');
const path = require('path');

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
            .on('data', (row) => { // event listener that gets the data stream
                if (isPlanetHabitable(row)) {
                    habitablePlanets.push(row); // rows are raw buffers of binary data if parse is not used
                }
            })
            .on('error', (error) => {
                reject(error);
            })
            .on('end', () => {
                resolve();
            }));

const getAllPlanets = () =>
    habitablePlanets;

module.exports = {
    getAllPlanets,
    loadPlanetsData
};
