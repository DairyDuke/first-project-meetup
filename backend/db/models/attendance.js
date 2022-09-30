'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addToList({ userId, eventId, status }) {

      const list = await Attendance.create({ userId, eventId, status })

      return await Attendance.findByPk(list.id);
    }

    static async updateList({ userId, eventId, status }) {

      const list = await Attendance.findOne({
        where: {
          eventId: eventId,
          userId: userId
        }
      })
      await list.update({ userId, eventId, status })

      return await Attendance.findByPk(list.id);
    }

    static associate(models) {
      // define association here
      Attendance.belongsTo(models.Event, { foreignKey: 'eventId' })
      Attendance.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Attendance.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Attendance',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    },
  });
  return Attendance;
};
