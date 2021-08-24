const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const profile = require("../models/profile");
const passport = require("passport");
const { Profile } = require("../models/profile");
const validateProfileInput = require("../validation/profile");
const validateExperienceInput = require("../validation/experience");
const validateEducationInput = require("../validation/education");
const { User } = require("../models/user");
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');


// @route api/v1/profile/test
// @desc Test profile route
// @access Public

router.get('/test', (req, res)=>{
    res.json({message: "profile works"})
});

// @route api/v1/profile
// @desc GET profile
// @access Private

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res)=>{
    const errors = {};
    try{
        const user = await Profile
                      .findOne({user: req.user._id})
                      .populate('user', ['firstName', 'lastName', 'email', 'userName']);
        if(!user){
            errors.noprofile = "There is no profile for this user.";
            return res.status(404).json(errors);
        }
        return res.json(user);
    }catch(error){
        return res.status(404).json(error);
    }
});

// @route api/v1/profile/
// @desc Create or edit profile
// @access Private

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res)=>{
    const { errors, isValid } = validateProfileInput(req.body);
       if(!isValid){
           return res.status(400).json(errors);
       }
    const profileFields = {};
          profileFields.user = req.user._id;
            if(req.body.bio) profileFields.bio = req.body.bio;
            if(req.body.status) profileFields.status = req.body.status;
            
        profileFields.address = {};
        if(req.body.addressLine1) profileFields.social.addressLine1 = req.body.addressLine1;
        if(req.body.addressLine2) profileFields.social.addressLine2 = req.body.addressLine2;
        if(req.body.city) profileFields.social.city = req.body.city;
        if(req.body.country) profileFields.social.country = req.body.country;
        if(req.body.postCode) profileFields.social.postCode = req.body.postCode;
        
        // Check if profile already exist
        const profile = await Profile.findOne({user: req.user._id});
        if(profile){
            // Update profile
            try{
            const updatedProfile =  await Profile.findOneAndUpdate(
                { user : req.user._id },
                { $set : profileFields },
                { new : true }
               );
            return res.json(updatedProfile);
            }catch(error){
                return res.status(404).json(error);
            }
        }else{
            // insert profile
            try{
             const newProfile =  await new Profile(profileFields).save();
             res.json(newProfile)
            }catch(error){
                return res.status(404).json(error);
            }
        }

    
});

// @route api/v1/handle:handle
// @desc GET profile by handle
// @access Public

router.get('/handle/:handle', async (req, res)=>{
    const errors = {};
    try{
        const user = await Profile
                      .findOne({handle: req.params.handle})
                      .populate('user', ['firstName', 'lastName', 'email']);
        if(!user){
            errors.noprofile = "There is no profile for this user.";
            res.status(404).json(errors);
        }
        return res.json(user);
    }catch(error){
        return res.status(404).json(error);
    }
});

// @route api/v1/user:user_id
// @desc GET profile by handle
// @access Public

router.get('/user/:user_id', async (req, res)=>{
    const errors = {};
    try{
        const user = await Profile
                      .findOne({user: req.params.user_id})
                      .populate('user', ['firstName', 'lastName', 'email']);
        if(!user){
            errors.noprofile = "There is no profile for this user.";
            res.status(404).json(errors);
        }
        return res.json(user);
    }catch(error){
        return res.status(404).json(error);
    }
});

// @route api/v1/profile/experience
// @desc add profile experience
// @access Private

router.post('/experience', passport.authenticate('jwt', {session: false}), async (req, res)=>{
    const { errors, isValid} = validateExperienceInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    try{
        const profile = await Profile.findOne({user: req.user._id});
        if(profile){

            const experience = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                desription: req.body.desription
            };
            profile.experience.unshift(experience);
            const updatedProfile = await profile.save()
            return res.json(updatedProfile);
        }
    }catch(error){
        return res.status(404).json(error);
    }
});

// @route api/v1/profile/education
// @desc add profile education
// @access Private

router.post('/education', passport.authenticate('jwt', {session: false}), async (req, res)=>{
    const { errors, isValid} = validateEducationInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    try{
        const profile = await Profile.findOne({user: req.user._id});
        if(profile){

            const education = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                desription: req.body.desription
            };
            profile.education.unshift(education);
            const updatedProfile = await profile.save()
            return res.json(updatedProfile);
        }
    }catch(error){
        return res.status(404).json(error);
    }
});

// @route api/v1/profile/experience/exp_id
// @desc delete profile experience
// @access Private

router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), async (req, res)=>{
    
    try{
        const profile = await Profile.findOne({user: req.user._id});
        if(profile){
            // get remove experience index
            const removeIndex = profile.experience
                                     .map(item => item._id)
                                     .indexOf(req.params.exp_id);
            //remove experience
            profile.experience.splice(removeIndex,1);
            const updatedProfile = await  profile.save();                         
            return res.json(updatedProfile);
                                                
        }
    }catch(error){
        return res.status(404).json(error);
    }
});

// @route api/v1/profile/education/exp_id
// @desc delete profile education
// @access Private

router.delete('/education/:exp_id', passport.authenticate('jwt', {session: false}), async (req, res)=>{
    
    try{
        const profile = await Profile.findOne({user: req.user._id});
        if(profile){
            // get remove education index
            const removeIndex = profile.education
                                     .map(item => item._id)
                                     .indexOf(req.params.exp_id);
            //remove education
            profile.education.splice(removeIndex,1);
            const updatedProfile = await  profile.save();                         
            return res.json(updatedProfile);
                                                
        }
    }catch(error){
        return res.status(404).json(error);
    }
});

// @route api/v1/profile
// @desc delete user and profile
// @access Private

router.delete('/', passport.authenticate('jwt', {session: false}), authorize(Role.admin), async (req, res)=>{
            const errors = {};
            try{
                    const profile = await Profile.findOneAndRemove({user: req.user._id});
                    if(!profile){
                        errors.noprofile = "There is no profile for this user.";
                        return res.status(404).json(errors);
                    }
                    const user = await User.findOneAndRemove({_id: req.user._id});
            }
            catch(error){
                return res.status(404).json(error);
            }
})

module.exports = router;