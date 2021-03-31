const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4
    },

    password: {
        type: String,
        required: true,
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    role: {
        type: String,
    },

    failedLoginCounter : {
        type : Number,
        default: 0
    },

    accountLocked : {
        type : Boolean,
        default : false
    }
}, { collection: 'users' });

schema.pre('save', function (next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync();
        this.password = bcrypt.hashSync(this.password, salt);
    }

    if(this.isModified('firstName')){
        this.firstName = this.firstName.trim();
    }

    if(this.isModified('lastName')){
        this.lastName = this.lastName.trim();
    }

    

    next();
})

module.exports = mongoose.model('User', schema);