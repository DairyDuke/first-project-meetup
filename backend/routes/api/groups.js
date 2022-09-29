const express = require('express')
const Sequelize = require('sequelize');
const { setTokenCookie, requireAuth, uniqueUser } = require('../../utils/auth');
const { User, Group, Event, Membership, Venue, GroupImage } = require('../../db/models');
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


// --------- Groups ----------- \\
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
        },
        {
          model: GroupImage,
          as: 'previewImage',
          attributes: ['url'],
          required: false,
          where: {
            preview: false
          }
        }
      ],
      group: ['Group.id']
    })

    res.json({ Groups })

  })

// Get all groups joined or organized by Current User
router.get(
  '/current',
  requireAuth,
  async (req, res, next) => {
    const { id, firstName, lastName, email } = req.user.dataValues

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
        },
        {
          model: GroupImage,
          as: 'previewImage',
          attributes: ['url'],
          required: false,
          where: {
            preview: false
          }
        }
      ],
      group: ['Group.id']
    })

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
    const organizerId = req.user.dataValues.id
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
    const currentUser = req.user.dataValues.id
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
  const currentUser = req.user.dataValues.id
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
    const currentUser = req.user.dataValues.id
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
  async (req, res, next) => {
    const currentUser = req.user.dataValues.id
    const groupId = req.params.groupId

    // need to check for member, organizer, or co-host.
    //
    const Venues = await Venue.findAll({
      where: {
        groupId: groupId
      },
      include: {
        model: Group,
        attributes: [],
        where: {
          [Op.or]: [{
            organizerId: currentUser
          },
          {

          }
          ]
        }
      },
      raw: true
    })
    // NTS need to put in error handling.
    if (!Venues) {
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


module.exports = router;
