const express = require('express')
const Sequelize = require('sequelize');
const {
  setTokenCookie,
  requireAuth,
  uniqueUser,
  checkHostCredentials,
  checkMemberCredentials,
  checkEventCredentials,
  checkEventHostOrUserCredentials
} = require('../../utils/auth');
const { alreadyEditAttending, memberEventExists, memberExists, alreadyAttending, eventExists, groupExists, venueExists, attendanceExists } = require('../../utils/verification')
const { User, Group, Event, Membership, Venue, GroupImage, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const Op = Sequelize.Op;

const router = express.Router();



// --------- Validators ----------- \\
// Checks req.body for potential Validation Errors
// name, about, type, private, city, state
const validateEvent = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage('Name must be at least 5 characters.'),
  check('type')
    .exists({ checkFalsy: true })
    .isIn(["online", "in person", "Online", "In Person", "ONLINE", "IN PERSON"])
    .withMessage("Type must be 'Online' or 'In person'."),
  check('capacity')
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Capacity must be an integer."),
  check('price')
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Price is invalid.'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required.'),
  check('startDate')
    .exists({ checkFalsy: true })
    .withMessage('Start date must be in the future.'),
  check('endDate')
    .exists({ checkFalsy: true })
    .withMessage('End date is less than start date.'),
  handleValidationErrors
];
const validateImage = [
  check('url')
    .exists({ checkFalsy: true })
    .isURL()
    .withMessage('Image URL must be a URL'),
  check('preview')
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage("Preview must be 'True' or 'False'."),
  handleValidationErrors
]


// --- Get All Events --- \\
router.get(
  '/',
  async (req, res, next) => {
    // -- Query Filter Parameter -- \\
    // page, integer,min 1, max 10, default 1
    // size, integer, min 1, max 20, default 20
    // name, string, optional
    // type, string, optional
    // startDate, string, optional
    const pagination = {}
    let { page, size, name, type, startDate } = req.query
    if (!page) { page = 1 }
    if (!size) { size = 20 }
    if (page) {
      check('page')
        .isNumeric()
        .bail()
        .withMessage('Page must be a number.')
        .isLength({ min: 1 })
        .withMessage('Page must be greater than or equal to 1'),
        handleValidationErrors
    }

    if (size) {
      check('size')
        .isNumeric()
        .bail()
        .withMessage('Size must be a number.')
        .isLength({ min: 1 })
        .withMessage('Size must be greater than or equal to 1'),
        handleValidationErrors
    }
    if (page > 10) { page = 10 }
    if (size > 20) { size = 20 }

    page = parseInt(page)
    size = parseInt(size)

    if (page >= 1 && size >= 1) {
      pagination.limit = size
      pagination.offset = size * (page - 1)
    }
    const where = {}
    if (name) {
      check('name')
        .isAlpha()
        .bail()
        .withMessage('Name must be a string'),
        handleValidationErrors

      where.name = name
    }
    if (type) {
      check('type')
        .isIn(["online", "in person"])
        .withMessage("Type must be 'Online' or 'In Person'"),
        handleValidationErrors
      where.type = type
    }
    if (startDate) {
      check('startDate')
        .isDate()
        .withMessage("Start date must be a valid datetime"),
        handleValidationErrors
      where.startDate = startDate
    }

    const Events = await Event.scope("event").findAll({
      where,
      ...pagination,
      raw: true
    })

    // -- Number Attending -- \\
    for (num of Events) {
      const eventId = num.id
      const numAttending = await Attendance.findAndCountAll({
        where: {
          eventId: eventId,
          status: { [Op.or]: ["host", "attending"] }
        },
        raw: true
      })
      if (numAttending) { num.numAttending = numAttending.count } else {
        num.numAttending = 0
      }
    }

    // -- Preview Image -- \\
    for (picture of Events) {
      const eventId = picture.id
      const previewImage = await EventImage.findOne({
        where: {
          eventId: eventId,
          preview: true
        },
        raw: true
      })
      if (previewImage) { picture.previewImage = previewImage.url } else {
        picture.previewImage = "Preview Image not found"
      }
    }

    // -- Group Associated -- \\
    for (group of Events) {
      const id = group.groupId
      const groups = await Group.scope("event").findOne({ id, raw: true })
      if (groups) { group.Group = groups } else {
        group.Group = "No Group Associated"
      }
    }

    // -- Venue Associated -- \\
    for (venue of Events) {
      const id = group.venueId
      const venues = await Venue.scope("event").findOne({ id, raw: true })
      if (venues) { venue.Venue = venues } else {
        venue.Venue = "null"
      }
    }

    return res.json({ Events })

  }
)


// --- Get All Attendeess of an Event by its ID --- \\
router.get(
  '/:eventId/attendees',
  eventExists,
  async (req, res, next) => {
    // -- Check Credentials -- \\
    const currentUser = req.user.id;
    const eventId = req.params.eventId;
    const eventDetails = await Event.findByPk(eventId, { raw: true })
    const groupId = eventDetails.groupId

    const credentials = await Group.findOne({
      where: {
        id: groupId
      },
      include: {
        model: Membership,
        attributes: [],
        where: {
          groupId: groupId,
          userId: currentUser,
          status: { [Op.or]: ["co-host", "organizer"] }
        }
      },
      raw: true
    })

    const attending = await Attendance.findAll({
      where: {
        eventId: eventId
      },
      attributes: ["userId", "status"]
    })

    let Attendees = []

    for (member of attending) {
      const user = await User.findByPk(member.userId, { raw: true })

      if (member.status != "pending") {
        Attendees.push({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          Attendance: { status: member.status }
        })
      } else if (credentials) {
        Attendees.push({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          Attendance: { status: member.status }
        })
      }

    }

    return res.json({ Attendees })
  })



// --- Edit Event by Event ID --- \\
router.put(
  '/:eventId',
  requireAuth,
  validateEvent,
  eventExists,
  venueExists,
  checkHostCredentials,
  async (req, res, next) => {
    const eventId = req.params.eventId;
    const event = await Event.findByPk(eventId, { raw: true });
    const groupId = event.groupId;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    const edit = await Event.editEvent({ eventId, venueId, groupId, name, type, capacity, price, description, startDate, endDate })

    return res.json(edit)

  })


// --- Add an Image to an Event based on the Event's id --- \\
router.post(
  '/:eventId/images',
  requireAuth,
  eventExists,
  checkEventCredentials,
  validateImage,
  async (req, res, next) => {
    const { url, preview } = req.body
    const eventId = req.params.eventId

    const image = await EventImage.create({
      eventId,
      url,
      preview
    });

    const verify = await GroupImage.findByPk(image.id);
    return res.json(verify)
  })



// --- Delete an Event specified by its id --- \\
router.delete(
  '/:eventId',
  requireAuth,
  eventExists,
  checkHostCredentials,
  async (req, res, next) => {
    const currentUser = req.user.id;
    const eventId = req.params.eventId;
    const event = await Event.findOne(
      {
        where: {
          id: eventId
        }
      })
    if (!event) {
      const err = new Error('Event Not Found');
      err.statusCode = 404;
      // err.title = 'Login failed';
      err.message = "Event couldn't be found"
      // err.errors = ['The provided credentials were invalid.'];
      return next(err);
    }
    await event.destroy()

    return res.json({
      message: "Successfully deleted",
      statusCode: 200
    })
  }
)

const validateAttendanceChange = [
  check('userId')
    .exists({ checkFalsy: true })
    .bail()
    .withMessage('Member Id required.'),
  check('status')
    .exists({ checkFalsy: true })
    .bail()
    .withMessage('Status Is required.')
    .not()
    .isIn(['pending'])
    .withMessage('Cannot change an attendance status to pending'),
  handleValidationErrors
]
// ---- Change .put, Request .post
// --- Request to Attend an Event based on the Event's id ---\\
router.post(
  '/:eventId/attendance',
  requireAuth,
  eventExists,
  memberEventExists,
  alreadyAttending,
  async (req, res, next) => {
    const status = "pending";
    const userId = req.user.id;
    const eventId = req.params.eventId;

    const create = await Attendance.addToList({ userId, eventId, status })
    const display = {
      userId: create.userId,
      status: create.status
    }
    return res.json(display)
  }
)

// --- Change the status of an attendance for an event specified by id ---\\
router.put(
  '/:eventId/attendance',
  requireAuth,
  eventExists,
  validateAttendanceChange,
  attendanceExists,
  checkHostCredentials,
  // alreadyEditAttending,
  async (req, res, next) => {
    const status = req.body.status;
    const userId = req.body.userId;
    const eventId = req.params.eventId;

    const create = await Attendance.updateList({ userId, eventId, status })
    return res.json(create)
  }
)
// -- Delete Attendance to an event specified by id -- \\
router.delete(
  '/:eventId/attendance',
  requireAuth,
  eventExists,
  attendanceExists,
  checkEventHostOrUserCredentials,
  async (req, res, next) => {
    const eventId = req.params.eventId;
    const userId = (req.body.userId != undefined ? req.body.userId
      : req.body.memberId != undefined ? req.body.memberId : null)


    const findAttendance = await Attendance.findOne({
      where: {
        eventId: eventId,
        userId: userId
      }
    });

    if (findAttendance) {
      findAttendance.destroy()
    } else {
      throw new Erorr(
        "something broke"
      )
    }
    return res.json({
      "message": "Successfully deleted membership from group",
    })

  }
)


// --- Get Event by Event ID --- \\
router.get(
  '/:eventId',
  eventExists,
  async (req, res, next) => {
    const currentEvent = req.params.eventId
    const Events = await Event.scope("eventbyId").findOne(
      {
        where: { id: currentEvent },
        raw: true
      }
    )

    // -- Number Attending -- \\
    const numAttending = await Attendance.findAndCountAll({
      where: {
        eventId: currentEvent,
        status: { [Op.or]: ["host", "attending"] } //waitlist?
      },
      raw: true
    })
    if (numAttending) { Events.numAttending = numAttending.count } else {
      Events.numAttending = 0
    }

    // -- Group Associated -- \\
    const groupId = Events.groupId
    const groups = await Group.scope("event").findOne({
      where: { id: groupId }
    })
    if (groups) { Events.Group = groups } else {
      Events.Group = "No Group Associated"
    }


    // -- Venue Associated -- \\
    const venues = await Venue.scope("event").findOne({
      where: { groupId: groupId },
      raw: true
    })
    if (venues) { Events.Venue = venues } else {
      Events.Venue = "null"
    }


    // -- Preview Image -- \\

    const EventImages = await EventImage.scope("event").findAll({
      where: {
        eventId: currentEvent
      }
    })
    if (EventImages) { Events.EventImages = EventImages } else {
      Events.EventImages = "Event Images not found"
    }


    return res.json(Events)

  })

module.exports = router;
