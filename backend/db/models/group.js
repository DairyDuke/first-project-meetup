'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.Event, { foreignKey: 'groupId' })
      Group.hasMany(models.Venue, { foreignKey: 'groupId' })
      Group.hasMany(models.GroupImage, { foreignKey: 'groupId' })
      Group.hasMany(models.Membership, { foreignKey: 'groupId' })
      Group.belongsTo(models.Users, { foreignKey: 'organizerId' })

    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
      //60 or less
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false
      //50 or more
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
      //either 'Online' or 'In Person'
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
      //true or false, no default.
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
      //required.
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
      //required
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
