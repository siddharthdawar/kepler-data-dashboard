const launchesDB = require('./launches.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const getLatestFlightNumber = async () => {
    // get the list, sort it (.sort) and return the first item (.findOne)
    const latestLaunch = await launchesDB
        .findOne() // return the first in the list
        .sort('-flightNumber'); // descending order

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber
};

const getAllLaunches = async () =>
    await launchesDB.find({}, {
        __v: 0,
        _id: 0
    });

const saveLaunch = async (launch) =>
    await launchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    });

const addNewLaunch = async (newLaunch) => {
    const latestFlightNumber = await getLatestFlightNumber();

    const launchObject = {
        ...newLaunch,
        customers: ['NASA'],
        flightNumber: latestFlightNumber + 1,
        success: true,
        upcoming: true
    };

    await saveLaunch(launchObject);
};

const doesFlightExist = async (flightNumber) =>
    await launchesDB.findOne({
        flightNumber
    });

const abortLaunch = async (flightNumber) =>
    await launchesDB.updateOne({
        flightNumber
    }, {
        success: false,
        upcoming: false
    });

module.exports = {
    abortLaunch,
    addNewLaunch,
    doesFlightExist,
    getAllLaunches
};
