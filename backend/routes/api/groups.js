const express = require('express')
const Sequelize = require('sequelize');
const {
  setTokenCookie,
  requireAuth,
  uniqueUser,
  checkHostCredentials,
  checkMemberCredentials,
  checkHostOrUserCredentials } = require('../../utils/auth');
const { membershipExists, userExists, groupExists, venueExists, memberExists } = require('../../utils/verification')
const { User, Group, Event, Membership, Venue, GroupImage, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const Op = Sequelize.Op;

const router = express.Router();


// --------- Validators ----------- \\
// Checks req.body for potential Validation Errors
// name, about, type, private, city, state
// const validateUser = [
//   check('memberId')
//     .custom(((value, { req }) => User.findByPk(memberId))
//       .then((data) => { if (data) return true })
//     )
//     .withMessage("User couldn't be found"),
//   handleValidationErrors
// ]
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
    .isIn(["online", "in person", "Online", "In Person", "In person", "ONLINE", "IN PERSON"])
    .withMessage("Type must be 'Online' or 'In person'."),
  check('private')
    .exists({ checkFalsy: true })
    .isBoolean()
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

const validateEvent = [
  check('venueId')
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Venue does not exist."),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage('Name must be at least 5 characters.'),
  check('type')
    .exists({ checkFalsy: true })
    .isIn(["online", "in person", "Online", "In Person", "In person", "ONLINE", "IN PERSON"])
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

const validateVenue = [
  check('groupId')
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Venue does not exist."),
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
    .withMessage('State address is required.'),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is required.'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is required.'),
  handleValidationErrors
];

const validateStatusChange = [
  // check('memberId')
  //   .exists({ checkFalsy: true })
  //   .bail()
  //   .withMessage('Member Id required.'),
  check('status')
    .not()
    .isIn(['pending', 'PENDING', 'Pending'])
    .withMessage('Cannot change a membership status to pending'),
  handleValidationErrors
]
// --- Get All Groups --- \\

// Get all groups joined or organized by Current User
// NTS Fix this.
router.get(
  '/current',
  requireAuth,
  async (req, res, next) => {
    const userId = req.user.id
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
                  [Op.or]: ["member", "co-host", "organizer"]
                }
              }, {
                userId: userId
              }]
          }
        }
      ],
      group: ['Group.id'],
      raw: true
    })

    for (picture of Groups) {
      picture.numMembers = parseInt(picture.numMembers)
      const groupId = picture.id
      const previewImage = await GroupImage.findOne({ where: { groupId, preview: true }, raw: true })
      if (previewImage) { picture.previewImage = previewImage.url } else {
        picture.previewImage = "Preview Image not found"
      }
    }

    return res.json({ Groups })
  })

// --- Get details of a Group from an id --- \\
router.get(
  '/:groupId',
  async (req, res, next) => {
    const groupId = req.params.groupId
    const Groups = await Group.findByPk(groupId, { raw: true })

    // const Groups = groupPull.toJSON()
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

    return res.json(Groups)
  })

// --- Add a Group Image to a Group based on its id --- \\
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

// --- Delete a Group specified by its id --- \\
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

// --- Get All Venues for a Group specified by its id --- \\
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
      const groups = await Group.scope("eventid").findOne({ id, raw: true })
      if (groups) { group.Group = groups } else {
        group.Group = "No Group Associated"
      }
    }

    // -- Venue Associated -- \\
    for (venue of Events) {
      const id = group.venueId
      const venues = await Venue.scope("eventid").findOne({ id, raw: true })
      if (venues) { venue.Venue = venues } else {
        venue.Venue = "null"
      }
    }

    return res.json({ Events })

  }
)

// --- Get all Members of a Group specified by its id --- \\
router.get(
  '/:groupId/members',
  groupExists,
  async (req, res, next) => {
    // -- Check Credentials -- \\
    const currentUser = req.user.id;
    const groupId = req.params.groupId;

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

    const memberShips = await Membership.findAll({
      where: {
        groupId: groupId
      },
      attributes: ["id", "userId", "status"]
    })

    let Members = []

    for (member of memberShips) {
      const user = await User.findByPk(member.userId, { raw: true })

      if (member.status != "pending") {
        Members.push({
          id: member.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          Membership: { status: member.status }
        })
      } else if (credentials) {
        Members.push({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          Membership: { status: member.status }
        })
      }

    }

    return res.json({ Members })
  })


// --- Create an Event for a Group specified by its id --- \\
router.post(
  '/:groupId/events',
  requireAuth,
  groupExists,
  validateEvent,
  venueExists,
  checkHostCredentials,
  async (req, res, next) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const status = "host"
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

    const create = await Event.createEvent({ venueId, groupId, name, type, capacity, price, description, startDate, endDate });
    // -- Creating an attendance spot for Host -- \\
    const eventId = create.id
    const createAttendance = await Attendance.addToList({ userId, eventId, status });
    return res.json(create)
  })



// -- Delete membership to a group specified by id -- \\
router.delete(
  '/:groupId/membership',
  requireAuth,
  groupExists,
  userExists,
  memberExists,
  checkHostOrUserCredentials,
  async (req, res, next) => {
    const groupId = req.params.groupId;
    const userId = req.body.memberId

    const findMember = await Membership.findOne({
      where: { userId: userId }
    });
    if (findMember) {
      findMember.destroy()
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

// --- Create a Venue for a Group specified by its id --- \\
router.post(
  '/:groupId/venues',
  requireAuth,
  validateVenue,
  groupExists,
  checkHostCredentials,
  async (req, res, next) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const { address, city, state, lat, lng } = req.body

    const create = await Venue.createVenue({ groupId, address, city, state, lat, lng });

    return res.json(create)
  })



// --- Request a Membership for a Group based on the Group's id --- \\
router.post(
  '/:groupId/membership',
  requireAuth,
  groupExists,
  membershipExists, //
  async (req, res, next) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;

    const status = "pending"
    const member = await Membership.addMember({ userId, groupId, status })

    const reply = {
      memberId: member.userId,
      status: member.status
    }
    return res.json(reply);
  })


// --- Change the status of a membership for a group specified by id --- \\
router.put(
  '/:groupId/membership',
  requireAuth,
  groupExists,
  validateStatusChange,
  checkHostCredentials,
  userExists,
  memberExists,
  async (req, res, next) => {
    const userId = req.body.memberId;
    const status = req.body.status
    const groupId = req.params.groupId;
    const err = new Error("Forbidding")
    err.message = "Only Organizer can make the request."
    err.statusCode = 403
    if (status == "co-host" && req.currentUserStatus != "organizer") { return next(err) }
    const member = await Membership.editMember({ userId, groupId, status })
    const display = {
      id: member.id,
      groupId: member.groupId,
      memberId: member.userId,
      status: member.status
    }

    return res.json(display);
  })

// --- Edit a Group specified by its Id --- \\

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

// --- Get All Groups --- \\
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
      picture.numMembers = parseInt(picture.numMembers)
      const groupId = picture.id
      const previewImage = await GroupImage.findOne({ where: { groupId, preview: true }, raw: true })
      if (previewImage) { picture.previewImage = previewImage.url } else {
        picture.previewImage = "Preview Image not found"
      }
    }
    return res.json({ Groups })

  })

// --- Create A Group --- \\
router.post(
  '/',
  requireAuth,
  validateGroup,
  async (req, res, next) => {
    // const { id, firstName, lastName, email } = req.user.dataValues
    const organizerId = req.user.id
    const { name, about, type, private, city, state } = req.body;
    const variable = private
    const group = await Group.createGroup({ name, organizerId, about, type, variable, city, state });
    const userId = req.user.id
    const groupId = group.id
    const status = "organizer"
    const member = await Membership.addMember({ userId, groupId, status })

    return res.json(group);

  })


module.exports = router;
