const express = require('express')
const Sequelize = require('sequelize');
const { setTokenCookie, requireAuth, uniqueUser } = require('../../utils/auth');
const { User, Group, Event, Membership, Venue, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const Op = Sequelize.Op;

const router = express.Router();

const validateGroup = []

// `id`, `organizerId`, `name`, `about`,
//`type`, `private`, `city`, `state`, `createdAt`,
// `updatedAt`, `numMembers`, and `previewImage`
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


module.exports = router;
