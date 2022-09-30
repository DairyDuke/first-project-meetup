'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async createEvent({ venueId, groupId, name, type, capacity, price, description, startDate, endDate }) {

      const event = await Event.create({
        venueId,
        groupId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
      });
      return await Event.findByPk(event.id);
    }

    static async editEvent({ eventId, venueId, groupId, name, type, capacity, price, description, startDate, endDate }) {

      const event = await Event.findByPk(eventId)
      await event.update({
        venueId,
        groupId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
      });
      return await Event.findByPk(eventId);
    }
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, { foreignKey: 'eventId' })
      Event.belongsTo(models.Venue, { foreignKey: 'venueId' })
      Event.belongsTo(models.Group, { foreignKey: 'groupId' })
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true

    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    },
    scopes: {
      event: {
        attributes:
          { exclude: ["description", "capacity", "createdAt", "updatedAt"] }//organizerId", "about", "type", "private", "createdAt", "updatedAt"]
      },
      eventbyId: {
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        }
      },
      edited: {
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        }
      }
    },
  });
  return Event;
};
