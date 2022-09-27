'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.

    // NTS - actually put a URL here
    const bulkData = [
      {
        groupId: 1,
        url: "this is a url",
        preview: true
      },
      {
        groupId: 2,
        url: "this is a url",
        preview: true
      },
      {
        groupId: 3,
        url: "this is a url",
        preview: false
      },
    ]
    return queryInterface.bulkInsert('GroupImages', bulkData, {});
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
    return queryInterface.bulkDelete('GroupImages', {

      // what to use to delete the above.
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
