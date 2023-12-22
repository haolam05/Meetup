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
    static associate(models) {
      Venue.belongsTo(
        models.Group,
        {
          foreignKey: 'groupId'
        }
      );

      Venue.belongsToMany(
        models.Group,
        {
          through: models.Event,
          foreignKey: 'venueId',
          otherKey: 'groupId'
        }
      );
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    }
  });
  return Venue;
};
