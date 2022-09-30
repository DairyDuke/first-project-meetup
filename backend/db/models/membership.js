'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addMember({ userId, groupId, status }) {

      const list = await Membership.create({ userId, groupId, status })

      return await Membership.findByPk(list.id);
    }

    static async editMember({ userId, groupId, status }) {

      const list = await Membership.findOne({
        where: {
          userId: userId,
          groupId: groupId
        }
      })
      list.update({
        userId,
        groupId,
        status
      })

      return await Membership.findByPk(list.id);
    }
    static associate(models) {
      // define association here
      Membership.belongsTo(models.User, { foreignKey: 'userId' })
      Membership.belongsTo(models.Group, { foreignKey: 'groupId' })
    }
  }
  Membership.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Membership',
    defaultScope: {
      attributes: { exclude: ["createdAt", "updatedAt"] }
    }
  });
  return Membership;
};
