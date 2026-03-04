const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    action:{
        type:String,
        required: true
    },
    by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
},{timestamps:true});

module.exports = mongoose.model("Log", LogSchema);