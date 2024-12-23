'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Record.belongsTo(models.User, {
        foreignKey:'userId',
        // as:'User'
      })
      Record.belongsTo(models.Category, {
        foreignKey:'categoryId',
        as:'Category'
      })
    }
  }
  Record.init({
    name: {
      type:DataTypes.STRING(5),
      allowNull: false
    },
    date: {
      type:DataTypes.STRING
    },
    amount: {
      type:DataTypes.STRING
    },
    userId:{
      type: DataTypes.INTEGER,
      // allowNull: false
    },
    categoryId:{
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Record',
    // timestamps:false
  });
  return Record;
};