const {Sequelize, DataTypes} = require('sequelize');
const category = require('./category');
const product = require('./product');
const sequelize = new Sequelize('Task','root','',{
    host : 'localhost',
    dialect : 'mysql',
    logging : false,
    pool : {max:5, min:0, idle : 10000}
});

sequelize.authenticate() //tests the connection to db
.then(()=>{
    console.log("Database is connected!") 
})
.catch((err)=>{
    console.log("Error: "+err)
})


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require('./admin')(sequelize,DataTypes);
db.users = require('./users')(sequelize,DataTypes);
db.category = require('./category')(sequelize,DataTypes);
db.product = require('./product')(sequelize,DataTypes);
db.category.hasMany(db.product)
db.product.belongsTo(db.category)


db.sequelize.sync({force : false}) // if true table drop and create new.
.then(()=>{
    console.log("Table created successfully....")
})


module.exports = db;