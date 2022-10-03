const express = require('express')
const Sequelize = require('sequelize');
const {
  setTokenCookie,
  requireAuth,
  uniqueUser,
  checkHostCredentials,
  checkMemberCredentials,
  checkHostOrUserCredentials } = require('../../utils/auth');
const { userExists, groupExists, venueExists, memberExists } = require('../../utils/verification')
const { User, Group, Event, Membership, Venue, GroupImage, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const Op = Sequelize.Op;

const router = express.Router();


// --------- Validators ----------- \\
const validateVenue = [
  check('address')
    .exists({ checkFalsy: true })
    .bail()
    .withMessage('Street address is required.'),
  check('city')
    .exists({ checkFalsy: true })
    .bail()
    .withMessage('City is required.'),
  check('state')
    .exists({ checkFalsy: true })
    .bail()
    .withMessage('State address is required.'),
  check('lat')
    .exists({ checkFalsy: true })
    .bail()
    .withMessage('Latitude is required.'),
  // .isDecimal()
  // .withMessage('Latitude must be coordinates'),
  check('lng')
    .exists({ checkFalsy: true })
    .bail()
    .withMessage('Longitude is required.'),
  handleValidationErrors
];

// --- Edit a Venue for a Group specified by its id --- \\
router.put(
  '/:venueId',
  requireAuth,
  validateVenue,
  venueExists,
  checkHostCredentials,
  async (req, res, next) => {
    const userId = req.user.id;
    const venueId = req.params.venueId;
    const { address, city, state, lat, lng } = req.body

    const create = await Venue.editVenue({ venueId, address, city, state, lat, lng });

    return res.json(create)
  })

module.exports = router;
