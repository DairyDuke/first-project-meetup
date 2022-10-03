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




    // // -- Get Group Organized by Current User and Count -- \\
    // for (group of allGroups) {
    //   const organizerId = group.organizerId
    //   const membership = await Membership.findAll()

    //   if (organizerId == userId) {
    //     const numMembers = await Attendance.findAndCountAll({
    //       where: {
    //         groupId: group.id
    //       },
    //       raw: true
    //     })
    //     if (numMembers) { Groups.numMembers = numMembers } else {
    //       Groups.numMembers = 0
    //     };
    //     Groups.push(group)
    //   }
    // }
    // {
    //   where: {
    //     organizerId: userId
    //   },
    //   required: false,
    //   attributes: {
    //     include: [
    //       [Sequelize.fn("COUNT", Sequelize.col("Memberships.groupId")), "numMembers"]
    //     ],
    //   },
    //   include: [
    //     {
    //       model: Membership,
    //       attributes: [],
    //       where: {
    //         [Op.and]: [
    //           {
    //             status: {
    //               [Op.or]: ["member", "co-host"]
    //             }
    //           }, {
    //             userId: userId
    //           }]
    //       }
    //     }
    //   ],
    //   group: ['Group.id'],
    //   raw: true
    // })
