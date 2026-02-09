const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
    },
   content:{
    type: String,
    require:true
   },
    role:{
        type:String,
        enum:["user", "model", "system"],
        default:"user"
    }
},{
    timestamps:true
})

const messageModel = mongoose.model("messages", messageSchema)

module.exports = messageModel