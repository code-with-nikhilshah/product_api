// models/Category.js
const Product = require('./product')
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('category', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },{
      paranoid: true,
      deletedAt:'soft_delete' // Enable paranoid mode
    });
    Category.associate = (models) => {
      Category.hasMany(models.Product, {
        foreignKey: 'categoryId',
        targetKey: 'id',
      });
    };
  
    return Category;
  };

  
  // "category_name":"electrical",
  // "description":"this is electrical category"