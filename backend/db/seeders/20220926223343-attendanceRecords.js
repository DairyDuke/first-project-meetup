'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.
    const bulkData = [
      {
        eventId: 1,
        userId: 1,
        status: "Attending"
      },
      {
        eventId: 2,
        userId: 2,
        status: "Not Attending"
      },
      {
        eventId: 3,
        userId: 3,
        status: "Absent"
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
      eventId: { [Op.in]: [1, 2, 3] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
