const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Membership, Group, Event, Attendance, EventImage, GroupImage, Venue } = require('../db/models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { secret, expiresIn } = jwtConfig;

// ------------------ This function will be used in the login/signup routes later
// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const token = jwt.sign(
    { data: user.toSafeObject() },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};

// The restoreUser middleware will be connected
// to the API router so that all API route handlers
// will check if there is a current user logged in or not.

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.scope('currentUser').findByPk(id);
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

// requireAuth will be connected directly to route handlers
// where there needs to be a current user logged in for the
// actions in those route handlers.

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error('Authentication');
  // err.title = 'Unauthorized';
  err.message = 'Authentication required';
  // err.errors = ['Unauthorized'];
  err.statusCode = 401;
  return next(err);
}

// During signup, checks for email in database.
const uniqueUser = async function (req, _res, next) {
  let { firstName, lastName, email, password, username } = req.body;
  const checkEmail = await User.scope('newUser').findOne({
    where: {
      email: email
    }
  });
  if (checkEmail) {
    const err = new Error('User Exists')
    // err.title = 'Forbidden';
    err.message = 'User already exists';
    err.errors = {
      "email": "User with that email already exists"
    };
    err.statusCode = 403;
    return next(err);
  }
  return next()
}

// -- Delete Event Image - Organizer or Co-host of Group that Owns Event -- \\
const checkEICredentials = async function (req, _res, next) {
  const err = new Error('Not Found');
  err.statusCode = 403;
  err.message = "Forbidden"

  const userId = req.user.id;
  const imageId = req.params.imageId;

  const eventImage = await EventImage.findByPk(imageId, { raw: true });
  const event = await Event.findByPk(eventImage.eventId, { raw: true });

  const checkCredentials = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: userId,
      status: { [Op.or]: ["organizer", "co-host"] }
    }
  })
  if (checkCredentials) { return next() } else {
    return next(err);
  }
}


// -- Delete Group Image - Organizer or Co-host of Group that Owns Event -- \\
const checkGICredentials = async function (req, _res, next) {
  const err = new Error('Not Found');
  err.statusCode = 403;
  err.message = "Forbidden"

  const userId = req.user.id;
  const imageId = req.params.imageId;

  const findGroupImage = await GroupImage.scope("groupData").findByPk(imageId, { raw: true });

  // const group = await Group.findByPk(findGroupImage.groupId, { raw: true });

  const checkCredentials = await Membership.findOne({
    where: {
      groupId: findGroupImage.groupId,
      userId: userId,
      status: { [Op.or]: ["organizer", "co-host"] }
    }
  })
  if (checkCredentials) { return next() } else {
    return next(err);
  }
}


// --- Member must be Organizer or Co-host of group --- \\
const checkHostCredentials = async function (req, _res, next) {
  const err = new Error('Not Found');
  err.statusCode = 403;
  err.message = "Forbidden"

  const { groupId, eventId, venueId } = req.params

  if (groupId) {
    const currentUser = req.user.id
    const checkCredentials = await Membership.findOne({
      where: {
        groupId: groupId,
        userId: currentUser,
        status: { [Op.or]: ["organizer", "co-host"] }
      }
    })

    if (checkCredentials) { return next() } else {
      return next(err);
    }
  }

  if (eventId) {
    const event = await Event.findByPk(eventId, { raw: true })
    if (!event) { return next(err); }
    const currentUser = req.user.id
    const checkCredentials = await Membership.findOne({
      where: {
        groupId: event.groupId,
        userId: currentUser,
        status: "co-host",
      },
      raw: true
    })
    const checkPermission = await Group.findOne({
      where: { organizerId: currentUser },
      raw: true
    })
    console.log(checkCredentials)
    if (checkCredentials || checkPermission) { return next() } else {
      return next(err);
    }
  }


  if (venueId) {
    const currentUser = req.user.id
    const event = await Venue.findByPk(venueId, { raw: true });
    const groupId = event.groupId

    const checkCredentials = await Membership.findOne({
      where: {
        groupId: groupId,
        userId: currentUser,
        status: { [Op.or]: ["organizer", "co-host"] }
      }
    })

    if (checkCredentials) { return next() } else {
      return next(err);
    }
  }


}


//Member must be Organizer, Co-host, or Member of group
const checkMemberCredentials = async function (req, _res, next) {

  const currentUser = req.user.id
  const groupId = req.params.groupId

  const checkCredentials = await Membership.findOne({
    where: {
      groupId: groupId,
      userId: currentUser,
      status: { [Op.or]: ["member", "co-host"] }
    },
    include: [{
      model: Group,
      attributes: [],
      required: false,
      where: { organizerId: currentUser }
    }],
    raw: true
  })

  if (checkCredentials) { return next() } else {
    const err = new Error('Not Found');
    err.statusCode = 404;
    // err.title = '';
    err.message = "Group couldn't be found"
    // err.errors = [''];
    return next(err);
  }
}
// --- Auth Req: Host, Attendee, or co-host --- \\
const checkEventCredentials = async function (req, _res, next) {

  const currentUser = req.user.id
  const { groupId, eventId } = req.params

  const checkCredentials = await Attendance.findOne({
    where: {
      eventId,
      userId: currentUser,
      status: { [Op.or]: ["attending", "co-host", "host"] }
    }
  })

  if (checkCredentials) { return next() } else {
    const err = new Error('Not Found');
    err.statusCode = 403;
    // err.title = '';
    err.message = "Forbidden"
    // err.errors = [''];
    return next(err);
  }

}


// --- Member must be Organizer of group or Currnet User--- \\
const checkHostOrUserCredentials = async function (req, _res, next) {
  const err = new Error('Not Found');
  err.statusCode = 403;
  err.message = "Forbidden"

  const currentUser = req.user.id;
  const groupId = req.params.groupId;
  const userId = req.body.memberId;

  const getGroup = await Group.findByPk(groupId, { raw: true })

  if (currentUser == userId) { return next() }
  if (getGroup.organizerId == currentUser) { return next() }
  return next(err)

  // else {

  // const checkCredentials = await Membership.findOne({
  //   where: {
  //     userId: userId
  //   }, raw: true
  // })

  //   return next(err);
  // }
  // if (currentUser == checkCredentials.userId) { return next() } else {
  //   return next(err);
  // }
  //membership gives us:
  // id = memberId
  // UserId = see if currentUserId
  // GroupId = confirm params groupId matches
  // Status = gives us organizer or member or pending etc.
  // status: { [Op.or]: ["organizer", "member"] }

  // -- Verify if Current User is Organizer -- \\
  // if (checkCredentials.groupId == groupId) { //verify we're looking at a member for the same group

  //   // -- Verify if Current User is Member of Group \\

  // } else { return next(err) }
}



// --- Member must be Organizer of group or Currnet User--- \\
const checkEventHostOrUserCredentials = async function (req, _res, next) {
  const err = new Error('Forbidden');
  err.statusCode = 403;
  err.message = "Only the User or organizer may delete an Attendance";

  const currentUser = req.user.id;
  const eventId = req.params.eventId;
  const userId = req.body.userId;

  const checkCredentials = await Attendance.findOne({
    where: {
      eventId: eventId,
      userId: userId
    },
    raw: true
  })
  const getGroup = await Group.findOne({
    include: {
      model: Event,
      attributes: [],
      where: {
        id: eventId
      }
    },
    raw: true
  })

  //membership gives us:
  // id = memberId
  // UserId = see if currentUserId
  // GroupId = confirm params groupId matches
  // Status = gives us organizer or member or pending etc.
  // status: { [Op.or]: ["organizer", "member"] }

  // -- Verify if Current User is User being deleted -- \\
  if (userId == currentUser) { return next() }
  else if (currentUser == getGroup.organizerId) { return next() }
  else { return next(err) }



  // if (checkCredentials.groupId == groupId) { //verify we're looking at a member for the same group
  //   const getGroup = await Group.findByPk(checkCredentials.groupId, { raw: true })
  //   if (getGroup && getGroup.organizerId == currentUser) { return next() }
  //   // -- Verify if Current User is Member of Group \\
  //   if (currentUser == checkCredentials.userId) { return next() } else {
  //     return next(err);
  //   }
  // } else { return next(err) }
}

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth,
  uniqueUser,
  checkHostCredentials,
  checkMemberCredentials,
  checkEventCredentials,
  checkEICredentials,
  checkHostOrUserCredentials,
  checkEventHostOrUserCredentials,
  checkGICredentials
};
