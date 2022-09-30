'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */


    static async createVenue({ groupId, address, city, state, lat, lng }) {

      const venue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng
      });
      return await Venue.findByPk(venue.id);
    }

    static async editVenue({ venueId, address, city, state, lat, lng }) {

      const venue = await Venue.findByPk(venueId)

      await venue.update({
        address,
        city,
        state,
        lat,
        lng
      });
      return await Venue.findByPk(venue.id);
    }
    static associate(models) {
      // define association here
      Venue.hasMany(models.Event, { foreignKey: 'venueId' })
      Venue.belongsTo(models.Group, { foreignKey: 'groupId' })
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    },
    scopes: {
      event: {
        attributes:
          ["id", "city", "state"]//organizerId", "about", "type", "private", "createdAt", "updatedAt"]

      }
    }
  });
  return Venue;
};
