const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    }]
}, { timestamps: true });

module.exports = mongoose.model("Like", LikeSchema);