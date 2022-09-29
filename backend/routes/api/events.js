const express = require('express')
const Sequelize = require('sequelize');
const {
  setTokenCookie,
  requireAuth,
  uniqueUser,
  checkHostCredentials,
  checkMemberCredentials } = require('../../utils/auth');
const { eventExists, groupExists } = require('../../utils/verification')
const { User, Group, Event, Membership, Venue, GroupImage, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const Op = Sequelize.Op;

const router = express.Router();

// --- Get All Events --- \\
router.get(
  '/',
  async (req, res, next) => {
    // Get All Events Requires:
    // numAttending = Attendances table --- Lazy Loaded --Success
    // numAttending returns a count
    // previewImage = EventImages table --- Lazy Loaded --Success
    // previewImage returns image URL
    // Group = Group table              --- Lazy Loaded --Success
    // Group returns id, name, city, state
    // Venue = Venue table
    // Venue returns id, city, state.
    const Events = await Event.scope("event").findAll({
      // attributes: {
      //   include: [
      //     [Sequelize.fn("COUNT", Sequelize.col("Attendances.eventId"), Sequelize.where()), "numAttending"]
      //   ],
      // },
      // include: [
      //   {
      //     model: Membership,
      //     attributes: []
      //   }
      //   // {
      //   //   model: GroupImage,
      //   //   as: 'previewImage',
      //   //   attributes: ['url'],
      //   //   required: false,
      //   //   where: {
      //   //     preview: false
      //   //   }
      //   // }
      // ],
      // group: ['Group.id'],
      raw: true
    })
    // -- Number Attending -- \\
    for (num of Events) {
      const eventId = num.id
      const numAttending = await Attendance.findAndCountAll({
        where: {
          eventId: eventId,
          status: { [Op.or]: ["host", "attending"] } //waitlist?
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
      where: { id: groupId },
      raw: true
    })
    if (groups) { Events.Group = groups } else {
      Events.Group = "No Group Associated"
    }


    // -- Venue Associated -- \\
    const venues = await Venue.findOne({
      where: { groupId: groupId },
      raw: true
    })
    if (venues) { Events.Venue = venues } else {
      Events.Venue = "null"
    }


    // -- Preview Image -- \\

    const previewImage = await EventImage.scope("eventbyId").findAll({
      where: {
        eventId: currentEvent
      }
    })
    if (previewImage) { Events.previewImage = previewImage } else {
      Events.previewImage = "Preview Image not found"
    }


    return res.json(Events)

  })


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

module.exports = router;
