const launches = new Map();

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('June 06, 2030'),
    target: 'Kepler-442 b',
    customers: ['NASA'],
    upcoming: true,
    success: true
};

launches.set(launch.flightNumber, launch);

const getAllLaunches = () =>
    Array.from(launches.values());

const addNewLaunch = (newLaunch) => {
    latestFlightNumber++;

    const launchObject = {
        ...newLaunch,
        customers: ['NASA'],
        flightNumber: latestFlightNumber,
        success: true,
        upcoming: true
    };

    launches.set(latestFlightNumber, launchObject);

    return launchObject;
};

const abortLaunch = (flightNumber) => {
    const launchToAbort = launches.get(flightNumber);

    if (launchToAbort) {
        launchToAbort.upcoming = false;
        launchToAbort.success = false;
    }

    return launchToAbort;
};

module.exports = {
    abortLaunch,
    addNewLaunch,
    getAllLaunches
};
