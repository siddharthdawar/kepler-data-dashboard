const planetsModel = require('../../models/planets.model');

const getAllPlanets = async (req, res) =>
    res.status(200).json(await planetsModel.getAllPlanets()); // status is optional since express returns 200 by default

module.exports = {
    getAllPlanets
};
