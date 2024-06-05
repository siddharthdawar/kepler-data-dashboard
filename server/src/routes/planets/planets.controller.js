const planetsModel = require('../../models/planets.model');

const getAllPlanets = (req, res) =>
    res.status(200).json(planetsModel.getAllPlanets()); // status is optional since express returns 200 by default

module.exports = {
    getAllPlanets
};
