// models/Product.js
const Category = require('./category');
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      product_price : {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      }
    },
    //)
    {
      paranoid: true,
      deletedAt:'soft_delete' // Enable paranoid mode
    }
    );
  
    Product.associate = (models) => {
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        //onDelete: 'SET NULL',
       // onDelete: 'NO ACTION',
      });
    };
  
    return Product;
  };
  // "product_name":"mi note 9 pro",
  // "product_price":"15000",
  // "description":"mi note 9 pro is best phone",
  // "categoryId":"2"

  
  // "product_name":"sonata watch",
  // "product_price":"1500",
  // "description":"sonata watch is  the best watch",
  // "categoryId":"4"