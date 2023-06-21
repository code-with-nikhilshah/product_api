// create userroute user can access update his profile.
const usercontroller = require('../Controller/usercontroller');
const userMiddleware = require('../middleware/usermiddleware');

const router2 = require('express').Router();

router2.post('/signup',usercontroller.signupuser);

router2.post('/login',usercontroller.loginuser);

router2.put('/update_profile/:id',userMiddleware,usercontroller.Update_profile);

router2.put('/change_password',usercontroller.user_ChangePassword);

module.exports = router2;
