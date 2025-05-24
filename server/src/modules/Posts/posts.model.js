const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
    slug: String,
    content: String,
    media: [String],
    tags: [String],
    location: String,
    visibility: {
        type: String,
        enum: ['public', 'private', 'friends'],
        defaul: 'public'
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

}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
})
const postModel = mongoose.model("Posts", PostSchema)
module.exports = postModel