const express = require('express');
const router = express.Router();
const admin = require('./admin.service');
const asyncHandler = require('express-async-handler');
const ROLES = require('../commons/util');
const { Unauthorized } = require('http-errors');

router.patch('/unlock-user/:id', asyncHandler(async (req, res) => {
    if(!ROLES.isAdmin(req.user.role))
        throw new Unauthorized();

    const {id} = req.params;
    const result = await admin.unlock(id);
    if(result){
        res.status(200).json({message:'User has successfully been unlocked!'});
    }
    
}));

router.patch('/lock-user/:id', asyncHandler(async (req, res) => {
    if(!ROLES.isAdmin(req.user.role))
        throw new Unauthorized();

    const {id} = req.params;
    const result = await admin.lock(id);
    if(result){
        res.status(200).json({message:'User has successfully been locked!'});
    }
    
}));

module.exports = router;