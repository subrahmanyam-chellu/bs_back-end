const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default:""
    },
    content: {
        type: String,
        required: true
    },
    penName: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true
    }
},
    { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);