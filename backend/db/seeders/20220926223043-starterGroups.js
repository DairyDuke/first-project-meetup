'use strict';

const bulkData = [
  {
    organizerId: 1,
    name: "Bobs Burgers",
    about: "This group is about talking about the show Bobs burgers and then cooking burgers too.",
    type: "TypeB",
    private: false,
    city: "Orlando",
    state: "FL"
  },
  {
    organizerId: 2,
    name: "Fake Friends",
    about: "This group is about scheduling a time to meet with people who are not actually friends.",
    type: "TypeA",
    private: true,
    city: "Miami",
    state: "FL"
  },
  {
    organizerId: 3,
    name: "Programers Anon",
    about: "This group is about programmers who are unable to admit when they forget how to do something.",
    type: "TypeX",
    private: true,
    city: "New York",
    state: "FL"
  }
]
module.exports = {
  up: async (queryInterface, Sequelize) => {
    //writing out bulk data in a variable for easy reference.
    return queryInterface.bulkInsert('Groups', bulkData, {});
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
    return queryInterface.bulkDelete('Groups', {
      // what to use to delete the above.
      where: {
        state: "FL"
      }
    }, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
