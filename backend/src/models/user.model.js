const mogoose = require('mongoose')

const userSchema = new mogoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        firstName: {
            type: String,
            require: true,
        },
        lastName: {
            type: String,
            require: true,
        },
    },
    password: {
        type: String,
    }
},
    {
        timestamps: true
    }
)

const userModel = mogoose.model('users', userSchema)

module.exports = userModel