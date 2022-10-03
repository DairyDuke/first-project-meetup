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
    static async createGroup({ name, organizerId, about, type, variable, city, state }) {

      const group = await Group.create({
        name,
        organizerId,
        about,
        type,
        private: variable,
        city,
        state
      });
      return await Group.findByPk(group.id);
    }

    static associate(models) {
      // define association here
      Group.hasMany(models.Event, { foreignKey: 'groupId' })
      Group.hasMany(models.Venue, { foreignKey: 'groupId' })
      Group.hasMany(models.GroupImage, { foreignKey: 'groupId' })
      Group.hasMany(models.Membership, { foreignKey: 'groupId' })
      Group.belongsTo(models.User, { foreignKey: 'organizerId', onDelete: 'CASCADE' })

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
    defaultScope: {
      attributes: {
        exclude: []
      }
    },

    // `id`, `organizerId`, `name`, `about`,
    //`type`, `private`, `city`, `state`, `createdAt`,
    // `updatedAt`, `numMembers`, and `previewImage`
    scopes: {
      event: {
        attributes: {
          exclude: ["organizerId", "about", "type", "createdAt", "updatedAt"]
        }
      },
      eventId: {
        attributes: {
          exclude: ["organizerId", "about", "type", "createdAt", "updatedAt"]
        }
      },
      eventid: {
        attributes: ["id", "name", "city", "state"]
      }
    }
  });
  return Group;
};
