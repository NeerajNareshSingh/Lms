const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const {User} = require('../models/user');
const config = require("config");
const jwtPrivateKey = config.get('jwtPrivateKey');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtPrivateKey;

module.exports = passport =>{
    passport.use(
        new JwtStrategy(opts, function(jwt_payload, done) {
            User.findById(jwt_payload._id)
                .then(user =>{
                    if(user){
                        return done(null, user)
                    }else{
                        return done(null, false)
                    }
                })
                .catch(err => console.log(err));
        })
    );
}