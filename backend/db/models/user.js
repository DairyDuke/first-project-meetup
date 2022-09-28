'use strict';
const { Model, Validator } = require('sequelize');
// bcrypt package to compare the password and the hashedPassword
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Returns an object with only the User instance
    // information that is safe to save to a JWT
    toSafeObject() {
      const { id, firstName, lastName, username, email } = this; // context will be the User instance
      return { id, firstName, lastName, username, email };
    }
    // Returns true if matches User instance's hashedPassword
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }
    // Uses currentUser scope to return a User with that id
    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }
    // Searches for one User with the specified credential
    // (either a USERNAME or EMAIL)
    // If found, it will validate password by passing it
    // into the instance's .validatePassword.
    // If valid, it should return the user by ussing
    // the currentUser scope.
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }
    // Hash the password using bcryptjs' hashSync method.
    // Create a User with the username, email, and hashedPassword
    // Returns the created user using the currentUser scope
    static async signup({ firstName, lastName, username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        hashedPassword
      });
      return await User.scope('newUser').findByPk(user.id);
    }

    static associate(models) {
      // define association here
      User.hasMany(models.Group, { foreignKey: 'organizerId', onDelete: 'CASCADE' })
      User.hasMany(models.Membership, { foreignKey: 'userId' })
      User.hasMany(models.Attendance, { foreignKey: 'userId' })
    }
  };

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 30]
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 30]
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30]
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ["hashedPassword", "username", "createdAt", "updatedAt"] }
        },
        newUser: {
          attributes: { exclude: ["hashedPassword", "username", "createdAt", "updatedAt"] }
        },
        loginUser: {
          attributes: {}
        },
        organizer: {
          attributes: { exclude: ["hashedPassword", "email", "username", "createdAt", "updatedAt"] }
        }
      }
    }
  );
  return User;
};
