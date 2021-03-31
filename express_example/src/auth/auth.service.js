const User = require('../users/user.entity');
const { Unauthorized, Locked } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async validate(username, password) {
        const user = await User.findOne({ username });

        if(user && user.accountLocked){
            throw new Locked('The user is locked!');
        }
        
        if (!user || !bcrypt.compareSync(password, user.password)) {
            if(user){
                user.failedLoginCounter = user.failedLoginCounter+1;
                if(user.failedLoginCounter == 3){
                    user.accountLocked = true;
                    await user.save();
                    throw new Locked('The user is locked!');
                }
                await user.save();
            }

            throw new Unauthorized();
        }
        
        user.failedLoginCounter = 0;
        return user;
    }

    async login(username, password) {
        const user = await this.validate(username, password);

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        return token;
    }

    validateToken(token) {
        const obj = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: false
        })

        return { userId: obj.userId, username: obj.username };
    }
}

module.exports = new AuthService();