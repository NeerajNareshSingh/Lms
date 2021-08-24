const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const profileSchema = new mongoose.Schema({
    user: {
        type:ObjectId,
        ref: "user"
    },
    bio: {
        type:String
    },
    address: [
        {
            addressLine1: {
                type:String,
                required: true
            },
            addressLine2: {
                type:String
            },
            city: {
                type:String,
                required: true
            },
            state: {
                type:String,
                required: true
                },
            country: {
                type: Date,
                required: true
            },
            postCode: {
                type: String, 
                required: true  
            }

        }
    ]

})

const Profile = new mongoose.model('profile', profileSchema);
exports.Profile = Profile;