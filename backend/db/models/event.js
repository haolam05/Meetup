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
    static associate(models) {
      Event.hasMany(
        models.EventImage,
        {
          foreignKey: 'eventId',
          hooks: true,
          onDelete: 'cascade'
        }
      );

      Event.belongsToMany(
        models.User,
        {
          through: models.Attendance,
          foreignKey: 'eventId',
          otherKey: 'userId'
        }
      );
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM('Online', 'In person'),
      allowNull: false
    },
    capacity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    startDate: {
      tpye: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      tpye: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
