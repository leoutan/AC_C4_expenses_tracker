'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Record)
    }
  }
  Category.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    icon:{
      type:DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Category',
    timestamps:false
  });
  return Category;
};