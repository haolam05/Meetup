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
      Group.belongsTo(
        models.User,
        {
          foreignKey: 'organizerId'
        }
      );

      Group.hasMany(
        models.GroupImage,
        {
          foreignKey: 'groupId',
          hooks: true,
          onDelete: 'cascade'
        }
      );
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        lessThanMaxLen(val) {
          if (val.length > 60) {
            throw new Error('Name must be 60 characters or less');
          }
        }
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        moreThanMinLen(val) {
          if (val.length < 50) {
            throw new Error('About must be 50 characters or more')
          }
        }
      }
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      validate: {
        isIn: {
          args: [['Online', 'In person']],
          msg: "Type must be 'Online' or 'In person'"
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
