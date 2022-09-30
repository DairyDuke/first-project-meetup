const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { User, Group, Event, Membership, Venue, GroupImage, Attendance, EventImage } = require('../db/models');

const notFound = new Error('Not Found');
notFound.statusCode = 404;
// err.title = '';
notFound.message = "Group couldn't be found"
// err.errors = [''];

const groupExists = async (req, _res, next) => {

  const groupId = req.params.groupId
  const findGroup = await Group.findByPk(groupId)
  if (findGroup) { return next() } else {
    return next(notFound);
  }
};


const eventExists = async (req, _res, next) => {
  const eventId = req.params.eventId
  const findEvent = await Event.findByPk(eventId)
  if (findEvent) { return next() } else {
    const notFound = new Error('Not Found');
    notFound.statusCode = 404;
    // err.title = '';
    notFound.message = "Event couldn't be found"
    return next(notFound);
  }
};


const eventImageExists = async (req, _res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  err.message = "Event Image couldn't be found"

  const imageId = req.params.imageId
  const findEventImage = await EventImage.findByPk(imageId);
  if (findEventImage) { return next() } else { return next(err) };
};

const groupImageExists = async (req, _res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  err.message = "Group Image couldn't be found"

  const imageId = req.params.imageId
  const findGroupImage = await GroupImage.findByPk(imageId);
  if (findGroupImage) { return next() } else { return next(err) };
};


const venueExists = async (req, _res, next) => {
  const currentVenue = req.body.venueId
  if (!currentVenue) { return next() }
  const findVenue = await Venue.findByPk(currentVenue)
  if (findVenue) { return next() } else {
    const notFound = new Error('Not Found');
    notFound.statusCode = 404;
    // err.title = '';
    notFound.message = "Venue couldn't be found"
    return next(notFound);
  }
}

const userExists = async (req, _res, next) => {
  const err = new Error('Wrong Member');
  err.statusCode = 400;
  err.message = "Validation Error";
  err.errors = { memberId: "User couldn't be found" };

  const groupId = req.params.groupId
  const userId = req.body.memberId;
  const findUser = await User.findByPk(userId)

  if (findUser) { return next() } else {
    return next(err)
  }
}
const memberExists = async (req, _res, next) => {
  const err = new Error('Wrong Member');
  err.statusCode = 400;
  err.message = "Validation Error";
  err.errors = { memberId: "User couldn't be found" };

  const groupId = req.params.groupId
  const userId = req.body.memberId;
  const findMember = await Membership.findOne({
    where: {
      userId: userId,
      groupId: groupId
    }
  });

  if (findMember) {
    return next()
  } else {
    const memErr = new Error("Membership Fail");
    err.statusCode = 404;
    err.message = "Membership does not exist for this User"
    return next(memErr)
  }
};

const attendanceExists = async (req, _res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  err.message = "Attendance does not exist for this User"
  const eventId = req.params.eventId;
  const userId = req.body.userId;

  const findAttendance = await Attendance.findOne({
    where: {
      eventId: eventId,
      userId: userId
    }
  });
  console.log(findAttendance)
  if (findAttendance) { return next() } else { return next(err) };
};

module.exports = {
  groupExists,
  eventExists,
  venueExists,
  eventImageExists,
  memberExists,
  attendanceExists,
  groupImageExists,
  userExists
};
