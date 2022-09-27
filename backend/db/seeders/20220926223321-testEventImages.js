'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.
    const bulkData = [
      {
        eventId: 1,
        url: "this is a url",
        preview: true
      },
      {
        eventId: 2,
        url: "this is a url",
        preview: true
      },
      {
        eventId: 3,
        url: "this is a url",
        preview: false
      },
    ]
    return queryInterface.bulkInsert('EventImages', bulkData, {});
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
    return queryInterface.bulkDelete('EventImages', {
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
