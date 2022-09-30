const express = require('express')
const Sequelize = require('sequelize');
const {
  setTokenCookie,
  requireAuth,
  uniqueUser,
  checkHostCredentials,
  checkMemberCredentials,
  checkEventCredentials,
  checkEICredentials
} = require('../../utils/auth');
const { eventExists, eventImageExists, groupExists, venueExists } = require('../../utils/verification')
const { User, Group, Event, Membership, Venue, GroupImage, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const Op = Sequelize.Op;

const router = express.Router();

// -- Delete an Event-Image by Imageid -- \\
router.delete(
  '/:imageId',
  requireAuth,
  eventImageExists,
  checkEICredentials,
  async (req, res, next) => {
    const imageId = req.params.imageId;

    const findEventImage = await EventImage.findByPk(imageId);
    if (findEventImage) {
      findEventImage.destroy()
    } else {
      throw new Erorr(
        "something broke"
      )
    }
    return res.json({
      message: "Successfully Deleted",
      statusCode: 200
    })

  }
)



module.exports = router;
