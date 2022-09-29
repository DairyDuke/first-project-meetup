const express = require('express')
const Sequelize = require('sequelize');
const {
  setTokenCookie,
  requireAuth,
  uniqueUser,
  checkHostCredentials,
  checkMemberCredentials } = require('../../utils/auth');
const { groupExists } = require('../../utils/verification')
const { User, Group, Event, Membership, Venue, GroupImage, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const Op = Sequelize.Op;

const router = express.Router();


// --------- Validators ----------- \\
// Checks req.body for potential Validation Errors
// name, about, type, private, city, state
const validateGroup = [
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage('Name must be 60 characters or less.'),
  check('about')
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage('About must be 50 characters or more.'),
  check('type')
    .exists({ checkFalsy: true })
    //need to find choice validator
    .withMessage("Type must be 'Online' or 'In person'."),
  check('private')
    .exists({ checkFalsy: true })
    //boolean checker
    .withMessage("Private must be a boolean."),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required.'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required.'),
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


// --- Get All Groups --- \\
// Get All Groups
router.get(
  '/',
  async (req, res, next) => {
    const Groups = await Group.findAll({
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Memberships.groupId")), "numMembers"]
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
    return res.json({ Groups })

  })

// Get all groups joined or organized by Current User
router.get(
  '/current',
  requireAuth,
  async (req, res, next) => {
    const { id, firstName, lastName, email } = req.user

    const Groups = await Group.findAll({
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Memberships.groupId")), "numMembers"]
        ],
      },
      include: [
        {
          model: Membership,
          attributes: [],
          where: {
            [Op.and]: [
              {
                status: {
                  [Op.or]: ["member", "co-host"]
                }
              }, {
                userId: id
              }]
          }
        }
        // ,
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
    // Groups.getGroupImage({where: {preview:true}})

    // if (!Groups) {
    //   const err = new Error('Login failed');
    //   err.statusCode = 401;
    //   err.title = 'Login failed';
    //   err.message = 'Invalid credentials'
    //   err.errors = ['The provided credentials were invalid.'];
    //   return next(err);
    // }

    return res.json({ Groups })

  })

// Get details of a group by id
router.get(
  '/:groupId',
  async (req, res, next) => {
    const groupId = req.params.groupId
    const Groups = await Group.findByPk(groupId, { raw: true })
    // NTS need to put in error handling.
    if (!Groups) {
      const err = new Error('Not Found');
      err.statusCode = 404;
      // err.title = '';
      err.message = "Group couldn't be found"
      // err.errors = [''];
      return next(err);
    }
    Groups.numMembers = await Membership.count({ where: { groupId: groupId } })
    Groups.GroupImages = await GroupImage.findAll({
      where: { groupId: groupId },
      attributes: { exclude: ["groupId", "createdAt", "updatedAt"] }
    })
    Groups.Organizer = await User.scope("organizer").findByPk(Groups.organizerId)
    Groups.Venues = await Venue.findAll({ where: { groupId: groupId } })

    return res.json({ Groups })
  })


// Group Creation
router.post(
  '/',
  requireAuth,
  validateGroup,
  async (req, res, next) => {
    console.log(req.user)
    // const { id, firstName, lastName, email } = req.user.dataValues
    const organizerId = req.user.id
    const { name, about, type, private, city, state } = req.body;
    const variable = private
    const group = await Group.createGroup({ name, organizerId, about, type, variable, city, state });


    return res.json(group);

  })

// Add Image to GroupImages/Group
router.post(
  '/:groupId/images',
  requireAuth,
  validateImage,
  async (req, res, next) => {
    const currentUser = req.user.id
    const { url, preview } = req.body
    const groupId = req.params.groupId

    const group = await Group.findOne({
      where: {
        id: groupId,
        organizerId: currentUser
      }
    })
    if (group) {

      const image = await GroupImage.create({
        groupId,
        url,
        preview
      });

      const verify = await GroupImage.findByPk(image.id);
      return res.json(verify)
    }
    const err = new Error('Group Not Found');
    err.statusCode = 404;
    // err.title = 'Login failed';
    err.message = "Group couldn't be found"
    // err.errors = ['The provided credentials were invalid.'];
    return next(err);
  }
)

//Edit a Group

router.put('/:groupId', requireAuth, validateGroup, async (req, res, next) => {
  const currentUser = req.user.id
  const groupId = req.params.groupId
  const { name, about, type, private, city, state } = req.body

  const group = await Group.findOne({
    where: {
      id: groupId,
      organizerId: currentUser
    }
  })
  if (group) {
    await group.update(
      {
        name,
        organizerId: currentUser,
        about,
        type,
        private,
        city,
        state
      }
    )
    return res.json(group)
  }
  const err = new Error('Group Not Found');
  err.statusCode = 404;
  // err.title = 'Login failed';
  err.message = "Group couldn't be found"
  // err.errors = ['The provided credentials were invalid.'];
  return next(err);


})

//Delete a Group
router.delete(
  '/:groupId',
  requireAuth,
  async (req, res, next) => {
    const currentUser = req.user.id
    const group = await Group.findOne(
      {
        where: {
          id: req.params.groupId,
          organizerId: currentUser
        }
      })
    if (!group) {
      const err = new Error('Group Not Found');
      err.statusCode = 404;
      // err.title = 'Login failed';
      err.message = "Group couldn't be found"
      // err.errors = ['The provided credentials were invalid.'];
      return next(err);
    }
    await group.destroy()

    return res.json({
      message: "Successfully deleted",
      statusCode: 200
    })
  }
)


// --------- Venues ----------- \\


router.get(
  '/:groupId/venues',
  requireAuth,
  checkHostCredentials,
  async (req, res, next) => {
    const groupId = req.params.groupId

    const Venues = await Venue.findAll({
      where: {
        groupId: groupId
      },
      raw: true
    })
    // This is a backup.
    if (!Venues) {
      const err = new Error('Not Found');
      err.statusCode = 404;
      // err.title = '';
      err.message = "Group couldn't be found"
      // err.errors = [''];
      return next(err);
    }

    return res.json({ Venues })
  })

// --- Get All Events by Group ID --- \\
router.get(
  '/:groupId/events',
  groupExists,
  async (req, res, next) => {
    const currentGroup = req.params.groupId
    const Events = await Event.scope("event").findAll({
      where: { groupId: currentGroup },
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
      const venues = await Venue.findOne({ id, raw: true })
      if (venues) { venue.Venue = venues } else {
        venue.Venue = "null"
      }
    }

    return res.json({ Events })

  }
)



module.exports = router;
