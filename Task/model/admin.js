module.exports = (sequelize, DataTypes) =>{

    const Admin = sequelize.define("admin", {
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true
        },
        firstname : {
            type : DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type : DataTypes.STRING,
            allowNull : false,
        },
        email : {
            type : DataTypes.STRING,
            allowNull: false,
            unique:true,
        },
        password : {
            type:DataTypes.STRING,
            allowNull: false,
        },
        mobile_num : {
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,     
        },
        user_id : {
            type:DataTypes.INTEGER,
        }
    })
    return Admin;
}
// {
//     "firstname":"nikhil",
//     "lastname":"shah",
//     "email":"nikhil@gmail.com",
//     "password":"Nikhil@123",
//     "mobile_num":"7777906667"
// }
