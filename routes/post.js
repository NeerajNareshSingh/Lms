const express = require('express');
const router = express.Router();
const {validatePost, Post} = require('../models/post');
const auth = require("../middleware/auth");
const _ = require('lodash');
const passport = require('passport');

router.post('/createPost', auth, async(req, res)=>{
    const {error} = validatePost(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }
   const postObj = new Post(_.pick(req.body, ['title', 'description', 'image']));
         postObj.postedBy = req.user._id;
   const post =  await postObj.save();
   res.send({data:post, message:"Post created successfully!"})
});

router.get('/getPosts', passport.authenticate('jwt', { session: false }), async(req, res)=>{
    console.log('userID',req.user._id)
   const posts = await Post.find({postedBy:req.user._id}).select({title:1,description:1,comments:1});
   res.send({posts:posts, message:"Posts listed successfully!"})
})

module.exports = router;