'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.
    const bulkData = [
      //Each event is hosted by a single group.
      //event 1 is group1, venue 1
      //event 2 is group2, venue 2
      //event 3 is group 3, venue 3

      //Event 1 has 3 entries
      {
        eventId: 1,
        userId: 1,
        status: "host"
      },
      {
        eventId: 1,
        userId: 2,
        status: "attending"
      },
      {
        eventId: 1,
        userId: 3,
        status: "pending"
      },
      // Event 2 has 5 entries
      {
        eventId: 2,
        userId: 1,
        status: "host"
      },
      {
        eventId: 2,
        userId: 2,
        status: "attending"
      },
      {
        eventId: 2,
        userId: 5,
        status: "attending"
      },
      {
        eventId: 2,
        userId: 4,
        status: "pending"
      },
      {
        eventId: 2,
        userId: 3,
        status: "pending"
      },

      //Event 3 has 4 entries
      {
        eventId: 3,
        userId: 2,
        status: "host"
      },
      {
        eventId: 3,
        userId: 1,
        status: "pending"
      },
      {
        eventId: 3,
        userId: 5,
        status: "pending"
      },
      {
        eventId: 3,
        userId: 4,
        status: "pending"
      },

      //Event 4

      {
        eventId: 4,
        userId: 3,
        status: "host"
      },
      {
        eventId: 4,
        userId: 2,
        status: "attending"
      },
      {
        eventId: 4,
        userId: 5,
        status: "attending"
      },

      //Event 5
      {
        eventId: 5,
        userId: 3,
        status: "host"
      },

      //Event 6
      {
        eventId: 6,
        userId: 5,
        status: "host"
      }
    ]
    return queryInterface.bulkInsert('Attendances', bulkData, {});
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
    return queryInterface.bulkDelete('Attendances', {
      // what to use to delete the above.
      eventId: { [Op.in]: [1, 2, 3, 4, 5, 6] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
