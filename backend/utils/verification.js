const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { User, Group, Event, Membership, Venue, GroupImage, Attendance, EventImage } = require('../db/models');

const notFound = new Error('Not Found');
notFound.statusCode = 404;
// err.title = '';
notFound.message = "Group couldn't be found"
// err.errors = [''];

const groupExists = async (req, _res, next) => {

  const currentGroup = req.params.groupId
  const findGroup = await Group.findByPk(currentGroup)
  if (findGroup) { return next() } else {
    return next(notFound);
  }
};
const eventExists = async (req, _res, next) => {

  const currentEvent = req.params.eventId
  const findEvent = await Group.findByPk(currentEvent)
  if (findEvent) { return next() } else {
    const notFound = new Error('Not Found');
    notFound.statusCode = 404;
    // err.title = '';
    notFound.message = "Event couldn't be found"
    return next(notFound);
  }
};

const venueExists = async (req, _res, next) => {
  const currentVenue = req.body.venueId
  const findVenue = await Venue.findByPk(currentVenue)
  if (findVenue) { return next() } else {
    const notFound = new Error('Not Found');
    notFound.statusCode = 404;
    // err.title = '';
    notFound.message = "Venue couldn't be found"
    return next(notFound);
  }
}
module.exports = {
  groupExists,
  eventExists,
  venueExists
};