const path = require('path')
const {body , validationResult } = require ('express-validator');
const bcrypt = require('bcryptjs')
const db = require('../model');
const { where } = require('sequelize');
const User = db.users
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const jwtsec = "nikhil@123";

// 1 . user signup 

const signupuser =  [
body('firstname').notEmpty().withMessage('firstname is required'),
body('lastname').notEmpty().withMessage('lastname is required'),
body('email').isEmail().withMessage('Invalid email'),
body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
body('mobile_num').isLength(10).withMessage('mobile number should be 10 digit'),

// Controller logic for creating a user
async(req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  if(errors.isEmpty()){
      const hashedpassword = await bcrypt.hash(req.body.password,10);
      const adduser = await User.create({
          user_id : req.body.user_id,
          firstname : req.body.firstname,
          lastname : req.body.lastname,
          email : req.body.email,
          password : hashedpassword,
          mobile_num : req.body.mobile_num
      })
           res.status(200).json({message:"user sucessfully signup"})

  }
}
]

// 2. user login

const loginuser = async (req, res) => {
  const { email, mobile_num, password } = req.body;

  try {
    var user;

    if ( email ) {
      user = await User.findOne({
        where: { email }
      });
    } else if (mobile_num) {
      user = await User.findOne({
        where: { mobile_num }
      });
    } else {
      return res.status(400).send({ message: "Please provide either email or mobile number" });
    }

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send({ message: "Password is incorrect" });
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
  //const token = jwt.sign({user },'jwtsec');
  
  //return res.status(200).send({ message: "User successfully logged in" ,token : token});
  //const generateToken = (user)=>{
    const payload = {
      id: user.id,
      email: user.email,
      // Add more data as needed
    };

token =  jwt.sign(payload, 'jwtsec', { expiresIn: '24h' });
return res.status(200).send({ message: "User successfully logged in" ,token : token});
};


// 3. Usewr can acess update his profile
let Update_profile = async(req,res)=>{
  await body('firstname', 'First name is required').notEmpty().run(req);
  await body('lastname', 'Last name is required').notEmpty().run(req);
  await body('email', 'Invalid email address').isEmail().run(req);
 await body('mobile_num', 'Invalid mobile number').isMobilePhone().isLength(10).run(req);


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }



   const id = req.params.id;
  //const userId = req.user.id;
 //const id = 1;
 if (!User) {
  return res.status(404).json({ message: 'you can not acess prodfile update' });
}

  let info = {
     firstname : req.body.firstname,
     lastname : req.body.lastname,
     email : req.body.email,
     mobile_num : req.body.mobile_num
     }
  let Update_profile = await User.update( info, {where : {  id  }})
  res.status(200).send(Update_profile)
}

// 4. User can change paasword

const user_ChangePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }

    // Validate the new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: newHashedPassword });

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


 module.exports = {
    signupuser,
    loginuser,
    Update_profile,
    user_ChangePassword
 }