const express = require('express')
const Sequelize = require('sequelize');
const {
  setTokenCookie,
  requireAuth,
  uniqueUser,
  checkHostCredentials,
  checkMemberCredentials } = require('../../utils/auth');
const { User, Group, Event, Membership, Venue, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const Op = Sequelize.Op;

const router = express.Router();

// --- Get All Events --- \\
router.get(
  '/',
  async (req, res, next) => {
    // Get All Events Requires:
    // numAttending = Attendances table --- Eager Loaded
    // numAttending returns a count
    // previewImage = EventImages table --- Lazy Loaded
    // previewImage returns image URL
    // Group = Group table
    // Group returns id, name, city, state
    // Venue = Venue table
    // Venue returns id, city, state.
    const Events = await Event.findAll({
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Attendances.eventId")), "numAttending"]
        ],
      },
      include: [
        {
          model: Membership,
          attributes: []
        }
        // {
        //   model: GroupImage,
        //   as: 'previewImage',
        //   attributes: ['url'],
        //   required: false,
        //   where: {
        //     preview: false
        //   }
        // }
      ],
      group: ['Group.id'],
      raw: true
    })
    for (picture of Groups) {
      const groupId = picture.id
      const previewImage = await GroupImage.findOne({ where: { groupId, preview: true }, raw: true })
      if (previewImage) { picture.previewImage = previewImage.url } else {
        picture.previewImage = "Preview Image not found"
      }
    }
    res.json({ Groups })

  }
)



module.exports = router;
