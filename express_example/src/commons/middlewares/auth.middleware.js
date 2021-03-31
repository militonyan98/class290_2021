const { Forbidden } = require('http-errors');
const { validateToken } = require('../../auth/auth.service');
const users = require('../../users/users.service');
const {pathIsPublic} = require("../util")

const jwtMiddleware = async (req, res, next) => {
    if(pathIsPublic(req.url)){
        next();
        return;
    }

    let token;
    try {
        token = req.header('Authorization').split(' ')[1];
        const user = validateToken(token);
        const dbUser = await users.findOne(user.userId);
        
        if(checkUserLocked(dbUser)){
            throw new Locked('User is locked!');
        }
        
        user.role = dbUser.role;
        req.user = user;
    } catch (err) {
        return next(new Forbidden());
    }

    next();
}

const checkUserLocked = function(user){
    return user.userLocked;
}

jwtMiddleware.unless = require('express-unless');

module.exports = {
    jwtMiddleware
}