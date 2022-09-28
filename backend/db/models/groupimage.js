'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    // static async createImage({ currentUser, groupId, url, preview }) {
    //   const group = await GroupImage.findOne({
    //     where: {
    //       id: groupId,
    //       organizerId: currentUser
    //     },
    //     include: {
    //       model: Group

    //     }
    //   })
    //   if (!group) {
    //     return
    //   }
    //   const groupImage = await GroupImage.create({
    //     groupId,
    //     url,
    //     preview
    //   });

    //   return await GroupImage.findByPk(groupImage.id);
    // }

    static associate(models) {
      // define association here
      GroupImage.belongsTo(models.Group, { foreignKey: 'groupId', as: "previewImage" })
    }
  }
  GroupImage.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false

    }
  }, {
    sequelize,
    modelName: 'GroupImage',
    defaultScope: {
      attributes: { exclude: ["groupId", "createdAt", "updatedAt"] }
    }

  });
  return GroupImage;
};
