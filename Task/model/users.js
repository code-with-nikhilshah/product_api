module.exports = (sequelize, DataTypes) =>{

    const Users = sequelize.define("users", {
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
        }
    })
    return Users;
}

// {
//     "firstname":"Nikhil",
//     "lastname":"Shah",
//     "email":"abc@gmail.com",
//     "password":"11223344",
//     "mobile_num":"1234567890"
// }


// {
//     "firstname":"krunal",
//     "lastname":"shah",
//     "email":"krunal@gmail.com",
//     "password":"Krunal@123",
//     "mobile_num":"9999999999"
// }
