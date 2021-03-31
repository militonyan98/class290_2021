const User = require('../users/user.entity');
const { Unauthorized, Locked, NotFound } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../users/users.service')
class AdminService {
    async unlock(id){
        const dbUser = await user.findOne(id);
        if(!dbUser){
            throw new NotFound("User not found!");
            return false;
        }
        dbUser.userLocked = false;
        dbUser.failedLoginCounter = 0;
        await dbUser.save();
        return true;
    }

    async lock(id){
        const user = await user.findOne(id);
        if(!user){
            throw new NotFound("User not found!");
            return false;
        }
        user.userLocked = true;
        user.failedLoginCounter = 0;
        await user.save();
        return true;
    }
}

module.exports =  new AdminService();