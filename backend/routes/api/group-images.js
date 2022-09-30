const express = require('express')
const Sequelize = require('sequelize');
const {
  setTokenCookie,
  requireAuth,
  uniqueUser,
  checkHostCredentials,
  checkMemberCredentials,
  checkEventCredentials,
  checkEICredentials,
  checkGICredentials
} = require('../../utils/auth');
const { groupImageExists, eventExists, eventImageExists, groupExists, venueExists } = require('../../utils/verification')
const { User, Group, Event, Membership, Venue, GroupImage, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const Op = Sequelize.Op;

const router = express.Router();
// -- Delete an Image for a Group -- \\
router.delete(
  '/:imageId',
  requireAuth,
  groupImageExists,
  checkGICredentials,
  async (req, res, next) => {
    const imageId = req.params.imageId;

    const findGroupImage = await GroupImage.findByPk(imageId);
    if (findGroupImage) {
      findGroupImage.destroy()
    } else {
      throw new Error(
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
