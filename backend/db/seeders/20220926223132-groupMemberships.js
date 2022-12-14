'use strict';

// NEW: add this code to each migration file
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
// END of new code

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.
    const bulkData = [

      //5 total users
      // group 1, user1
      //group 2, user2,
      //group 3, user 3

      //Group 1 has 4 member
      {
        userId: 1,
        groupId: 1,
        status: "organizer"
      },
      {
        userId: 4,
        groupId: 1,
        status: "pending"
      },
      {
        userId: 5,
        groupId: 1,
        status: "member"
      },
      {
        userId: 2,
        groupId: 1,
        status: "member"
      },

      //Group 2 has 3 member
      {
        userId: 2,
        groupId: 2,
        status: "organizer"
      },
      {
        userId: 1,
        groupId: 2,
        status: "member"
      },
      {
        userId: 3,
        groupId: 2,
        status: "pending"
      },

      //Group 3 has 5 member
      {
        userId: 3,
        groupId: 3,
        status: "organizer"
      },
      {
        userId: 1,
        groupId: 3,
        status: "co-host"
      },
      {
        userId: 2,
        groupId: 3,
        status: "member"
      },
      {
        userId: 4,
        groupId: 3,
        status: "member"
      },
      {
        userId: 5,
        groupId: 3,
        status: "member"
      },
      // Group 4 has 2 member

      {
        userId: 4,
        groupId: 4,
        status: "organizer"
      },
      {
        userId: 1,
        groupId: 4,
        status: "member"
      },
      // Group 5 has 2 member

      {
        userId: 5,
        groupId: 5,
        status: "organizer"
      },
      {
        userId: 1,
        groupId: 5,
        status: "member"
      },
    ]
    options.tableName = 'Memberships'
    return queryInterface.bulkInsert(options, bulkData, {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    options.tableName = 'Memberships'
    return queryInterface.bulkDelete(options, {
      // what to use to delete the above.
      groupId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
