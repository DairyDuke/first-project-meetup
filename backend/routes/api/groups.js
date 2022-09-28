const express = require('express')
const Sequelize = require('sequelize');
const { setTokenCookie, requireAuth, uniqueUser } = require('../../utils/auth');
const { User, Group, Event, Membership, Venue, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const Op = Sequelize.Op;

const router = express.Router();
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

router.get(
  '/',
  async (req, res, next) => {
    const Groups = await Group.findAll({ raw: true })
    await Groups.forEach(element => {
      element.numMembers = Membership.count({ where: { groupId: element.Id } })
    });
    Groups.numMembers = await Membership.count({ where: { groupId: groupId } })
    Groups.GroupImages = await GroupImage.findAll({
      where: { groupId: groupId },
      attributes: { exclude: ["groupId", "createdAt", "updatedAt"] }
    })

    // const Groups = await Group.findAll({
    //   attributes: {
    //     include: [
    //       [Sequelize.fn("COUNT", Sequelize.col("Memberships.groupId")), "numMembers"]
    //     ],
    //   },
    //   include: [
    //     {
    //       model: Membership,
    //       attributes: []
    //     },
    //     {
    //       model: GroupImage,
    //       as: 'previewImage',
    //       attributes: ['url'],
    //       required: false,
    //       where: {
    //         preview: false
    //       }
    //     }
    //   ],
    //   group: ['Group.id']
    // })

    res.json({ Groups })
  })


router.get(
  '/current',
  requireAuth,
  async (req, res, next) => {
    const { id, firstName, lastName, email } = req.user.dataValues
    // Search all groups like query above -
    // grab current user Id
    // display groups where organizerId = current user
    // and where Membership included user when calculating numMembers
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
    if (!Groups) {
      const err = new Error('Login failed');
      err.statusCode = 401;
      err.title = 'Login failed';
      err.message = 'Invalid credentials'
      err.errors = ['The provided credentials were invalid.'];
      return next(err);
    }

    return res.json({ Groups })

  })


router.get(
  '/:groupId',
  async (req, res, next) => {
    const groupId = req.params.groupId
    // Try to Lazy Load:
    const Groups = await Group.findByPk(groupId, { raw: true })
    // if (!Groups) {
    //   const err = new Error('message');
    //   err.statusCode = 403;
    //   err.title = '';
    //   err.message = ''
    //   err.errors = [''];
    //   return next(err);
    // }


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
    const organizer = req.user.dataValues.id
    const { name, about, type, private, city, state } = req.body;
    const group = await Group.createGroup({ name, organizer, about, type, private, city, state });
    return res.json({
      group
    });

  })

module.exports = router;
