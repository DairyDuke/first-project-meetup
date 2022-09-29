const express = require('express')
const Sequelize = require('sequelize');
const {
  setTokenCookie,
  requireAuth,
  uniqueUser,
  checkHostCredentials,
  checkMemberCredentials } = require('../../utils/auth');
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
    const Events = await Event.findAll({
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
          eventId,
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
          eventId,
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

module.exports = router;
