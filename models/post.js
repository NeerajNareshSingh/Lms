const mongoose = require("mongoose");
const Joi = require('Joi');
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    likes:[{
        type:ObjectId,
        ref:'user'

    }],
    comments:[{
        text:String,
        postedBy:{
            type:ObjectId,
            ref:"user"
        }
    }],
    postedBy:{
        type:ObjectId,
        ref:"user"
    }
});
const Post = new mongoose.model('post', postSchema);
function validatePost(post) {
    const schema = Joi.object({
      title: Joi.string().min(5).max(255).required(),
      description: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(post);
  }

exports.validatePost = validatePost;
exports.Post = Post;