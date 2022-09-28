const express = require('express')
const Sequelize = require('sequelize');
const { setTokenCookie, requireAuth, uniqueUser } = require('../../utils/auth');
const { User, Group, Event, Membership, Venue, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateGroup = []

// `id`, `organizerId`, `name`, `about`,
//`type`, `private`, `city`, `state`, `createdAt`,
// `updatedAt`, `numMembers`, and `previewImage`
router.get(
  '/',
  async (req, res, next) => {
    // const allGroups = await Group.findAll({
    //   attributes: {
    //     include: [[Sequelize.fn("COUNT", Sequelize.col("Memberships.groupId")), "numMembers"]]
    //   },
    //   include: [{
    //     model: Membership,
    //     attributes: []
    //   }],
    // })
    const allGroups = await Group.findAll({
      attributes: {
        include: [[Sequelize.fn("COUNT", Sequelize.col("Memberships.groupId")), "numMembers"]]
      },
      include: [{
        model: Membership,
        attributes: []
      }],
      group: ['Group.id']
    })
    // const Groups = await allGroups.countMembership()
    // {
    //   attributes: ['Group.id', [Seuqlize.fn('COUNT', Sequelize.col('Membership.groupId')), 'numMembers']],
    //   include: [{
    //     model: Membership,
    //     attributes: []
    //   }],
    //   group: ['Group.id'],
    //   raw: true
    // }
    // const Groups = [];
    // const allMembers = await Membership.findAndCountAll()

    // allGroups.forEach(element => {
    //   element.numMembers = Membership.count({
    //     where: {
    //       id: element.groupId
    //     }
    //   })

    //   Groups.push(element)
    // });

    //numMembers = search Membership for group id
    //count memberships add value before sending.
    //previewImage = check GroupImage table to see if preview is true,
    // return url to add to Groups.

    // Setup function in group to count members, perhaps.

    res.json(allGroups)
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
    const allGroups = await Group.findAll(
      {
        where: {
          organizerId: id,
          include: {
            model: 'Membership',
            where: {
              userId: id
            }
          }
        }
      })

    res.json(allGroups)
    res.json('Read')
  })

router.get(
  '/:groupId',
  async (req, res, next) => {
    const groupId = req.params.groupId
    const allGroups = await Group.findByPk(groupId
      // {
      //   include: {
      //     model: 'GroupImage',
      //     attributes: ["preview"]

      //   }
      // }
    )

    res.json(allGroups)
  })


module.exports = router;
