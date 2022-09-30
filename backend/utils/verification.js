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
  const currentVenue = req.body.venueId ? req.body.venueId
    : req.params.venueId ? req.params.venueId
      : null


  const notFound = new Error('Not Found');
  notFound.statusCode = 404;
  notFound.message = "Venue couldn't be found"

  if (!currentVenue) { return next(notFound) }

  const findVenue = await Venue.findByPk(currentVenue)
  if (findVenue) { return next() } else {
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
const alreadyAttending = async (req, _res, next) => {

  const eventId = req.params.eventId;
  const userId = req.user.id;
  const status = req.body.status;

  const findAttendance = await Attendance.findOne({
    where: {
      eventId: eventId,
      userId: userId
    },
    raw: true
  });
  console.log(findAttendance)
  const err = new Error('Already Attending');
  err.statusCode = 400;
  err.message = "Attendance has already been requested"

  if (findAttendance) {
    if (findAttendance.status == "pending") {
      const err = new Error('Already Attending');
      err.statusCode = 400;
      err.message = "Attendance has already been requested"
      return next(err)
    } else
      if (findAttendance.status == "attending" || findAttendance.status == "host") {
        const err = new Error('Already Attending');
        err.statusCode = 400;
        err.message = "User is already an attendee of the event"
        return next(err)
      } else {
        return next()
      }
  } else {
    return next()
  };
}

// --- Current User must be a Member of the group --- \\
const memberEventExists = async (req, _res, next) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  const findEvent = await Event.findByPk(eventId, { raw: true })
  const groupId = findEvent.groupId

  const findMember = await Membership.findOne({
    where: {
      userId: userId,
      groupId: groupId,
      status: { [Op.or]: ["organizer", "member", "co-host"] }
    },
    raw: true
  });

  if (findMember) {
    return next()
  } else {
    const memErr = new Error("Membership Fail");
    err.statusCode = 403;
    err.message = "Only members may invite to Group Events."
    return next(memErr)
  }
}


const memberExists = async (req, _res, next) => {
  const err = new Error('Wrong Member');
  err.statusCode = 400;
  err.message = "Validation Error";
  err.errors = { memberId: "User couldn't be found" };

  const perr = new Error('Already Pending');
  err.statusCode = 400;
  err.message = "Membership has already been requested"

  const groupId = req.params.groupId
  const userId = req.body.memberId;
  const status = req.body.status;
  const findMember = await Membership.findOne({
    where: {
      userId: userId,
      groupId: groupId
    },
    raw: true
  });

  if (findMember) {
    return next()
  } else {
    const memErr = new Error("Membership Fail");
    memErr.statusCode = 404;
    memErr.message = "Membership does not exist for this User"
    return next(memErr)
  }
};


const membershipExists = async (req, _res, next) => {
  const perr = new Error('Already Pending');
  perr.statusCode = 400;
  perr.message = "Membership has already been requested"

  const aerr = new Error('Already Meember');
  aerr.statusCode = 400;
  aerr.message = "User is already a member of the group"

  const groupId = req.params.groupId
  const userId = req.user.id;
  const findMember = await Membership.findOne({
    where: {
      userId: userId,
      groupId: groupId
    },
    raw: true
  });

  if (findMember) {
    if (findMember.status == "pending") { return next(perr) }
    if (findMember.status == "member") { return next(aerr) }
  } else {
    return next()
  }
};

const attendanceExists = async (req, _res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  err.message = "Attendance does not exist for this User"
  const eventId = req.params.eventId;
  const userId = (req.body.userId != undefined ? req.body.userId
    : req.body.memberId != undefined ? req.body.memberId : null)

  const findAttendance = await Attendance.findOne({
    where: {
      eventId: eventId,
      userId: userId
    }
  });
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
  userExists,
  membershipExists,
  alreadyAttending,
  memberEventExists
};
