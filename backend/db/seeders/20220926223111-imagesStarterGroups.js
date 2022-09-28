'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.

    // NTS - actually put a URL here
    const bulkData = [
      //Group 1 has 2 images
      {
        groupId: 1,
        url: "www.picture.group1.1",
        preview: true
      },
      {
        groupId: 1,
        url: "www.picture.group1.2",
        preview: false
      },
      //Group 2 has 2 images
      {
        groupId: 2,
        url: "www.picture.group2.1",
        preview: true
      },
      {
        groupId: 2,
        url: "www.picture.group2.2",
        preview: true
      },
      //Group 3 has 1 image
      {
        groupId: 3,
        url: "www.picture.group3.1",
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
