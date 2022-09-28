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
