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

const getAllLaunches = async (skip, limit) =>
    await launchesDB
        .find({}, {
            __v: 0,
            _id: 0
        })
        .sort({
            flightNumber: 1 // 1 for ascending, -1 for descending
        })
        .skip(skip) // skip the first "foo" number of documents (mongoDB does not have inbuilt pagination feature)
        .limit(limit); // number of results per page

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

const findLaunch = async (filter) =>
    await launchesDB.findOne(filter);

const doesFlightExist = async (flightNumber) =>
    await findLaunch({
        flightNumber
    });

const abortLaunch = async (flightNumber) =>
    await launchesDB.updateOne({
        flightNumber
    }, {
        success: false,
        upcoming: false
    });

const populateDB = async () => {
    const body = {
        options: {
            pagination: false,
            populate: [
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                },
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                }
            ]
        },
        query: {}
    };

    const response = await fetch('https://api.spacexdata.com/v4/launches/query', {
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    });

    if (response.status !== 200) {
        throw new Error('Problem downloading spacex launches');
    }

    const data = await response.json();

    for (const doc of data.docs) {
        const launch = {
            customers: doc.payloads.flatMap((payload) => payload.customers),
            flightNumber: doc.flight_number,
            launchDate: doc.date_local,
            mission: doc.name,
            rocket: doc.rocket.name,
            success: doc.success,
            upcoming: doc.upcoming
        };

        await saveLaunch(launch);
    }
};

const loadSpaceXLaunches = async () => {
    const firstLaunch = await findLaunch({
        flightNumber: 1
    });

    // Launch data already fetched and saved in DB
    if (firstLaunch) {
        return;
    }

    await populateDB();
};

module.exports = {
    abortLaunch,
    addNewLaunch,
    doesFlightExist,
    getAllLaunches,
    loadSpaceXLaunches
};
