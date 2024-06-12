const launchesModel = require('../../models/launches.model');

const getAllLaunches = async (req, res) =>
    res.status(200).json(await launchesModel.getAllLaunches()); // status is optional since express returns 200 by default

const addNewLaunch = async (req, res) => {
    const {body} = req;
    const isBodyInvalid = Object.values(body).some((value) => !value);

    if (isBodyInvalid) {
        return res.status(400).json({
            error: 'Invalid request body'
        });
    }

    body.launchDate = new Date(body.launchDate);

    // isNaN will run valueOf on the date object
    // for valid dates, it will return epoch time
    if(isNaN(body.launchDate)) {
        return res.status(400).json({
            error: 'Invalid date'
        });
    }

    const newLaunch = await launchesModel.addNewLaunch(body);

    return res.status(201).json(newLaunch);
};

const abortLaunch = async (req, res) => {
    const {flightNumber} = req.params;

    if (!flightNumber) {
        return res.status(400).json({
            error: 'Flight number is required'
        });
    }

    const flight = await launchesModel.doesFlightExist(flightNumber);

    if (!flight) {
        return res.status(404).json({
            error: 'Flight not found'
        });
    }

    // convert flightNumber to a number before accessing model!!
    const abortedFlight = await launchesModel.abortLaunch(+flightNumber);

    if (abortedFlight) {
        return res.status(200).json(abortedFlight);
    }
};

module.exports = {
    abortLaunch,
    addNewLaunch,
    getAllLaunches
};
