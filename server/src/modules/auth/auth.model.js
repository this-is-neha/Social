const mongoose = require('mongoose');
// This is your schema definition in Mongoose.
// It tells MongoDB how each user document (record) should look like.
// Every user must have a name, email, password, and (optionally) activationToken, createdBy, updatedBy.
const Userschema=new mongoose.Schema({
name:{
    type:String,
    min:3,
    required:true,
},
image:String,
email:{
    type:String,
    required:true,
    unique:true,
}, 
follow: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
password:{
    type:String,
    min:6,
    required:true,
},
status: { type: String,
     enum: ['active', 'inactive'], 
     default: 'inactive' },
activationToken: {
    type: String
},
createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    default: null
},
 updatedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    default: null
}


},
{
    timestamps: true,
    autoCreate: true,
    autoIndex: true
}

)

const User=mongoose.model("User",Userschema)
module.exports=User