const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require("../middleware/auth");
const validateRegisterUserInput = require("../validation/register");
const validateLoginUserInput = require("../validation/login");
const passport = require('passport');

// @route GET api/v1/users/loggedInUser
// @desc Logged In User
// @acces Private
router.get('/loggedInUser', auth, async(req, res)=>{
    const user = await User.findById(req.user._id).select("-password");  
    return res.status(200).send(user);
});

// @route GET api/v1/users/current
// @desc Current User
// @acces Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res)=>{
    res.json({
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
    });
});

// @route GET api/v1/users/register
// @desc Register User
// @acces Publice
router.post('/register', async (req, res)=>{
        // check validation
        const {errors, isValid} = validateRegisterUserInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);
        }
        let isUserExist = await User.findOne({email:req.body.email});
        if(isUserExist){
            return res.status(400).send("user already exist");
        }
        const user = new User(_.pick(req.body, ['userName' ,'firstName', 'lastName', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(user.password, salt);
        user.password = hashed;
        await user.save();
        const jwtToken = user.generateAuthToken();
        res.header('x-auth-token',jwtToken).send(_.pick(user,['_id', 'name', 'email']));
});

// @route GET api/v1/users/auth
// @desc Logged In User
// @acces Public
router.post('/login', async (req, res)=>{
        // check validation
        const {errors, isValid} = validateLoginUserInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);
        }
        let user = await User.findOne()
                             .or([{email:req.body.email},{userName:req.body.email}]);
        if(!user){
            errors.email = "Invalid username or password"
            return res.status(400).json(errors);
        }
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if(!isValidPassword){
            errors.password = "Invalid username or password"
            return res.status(400).json(errors);
        }
        const jwtToken = user.generateAuthToken();
        const userDetail = {};
              userDetail.firstName = user.firstName;
              userDetail.lastName = user.lastName;
              userDetail.email = user.email;
        res.send({"token":'Bearer ' + jwtToken,"userDetail":userDetail});
        
});


module.exports = router;