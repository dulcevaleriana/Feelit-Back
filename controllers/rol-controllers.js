const httpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const Rol = require('../models/rol');

//get all rol
const getAllRoll = async (req,res,next) => {
    let getRol;

    try{
        getRol = await Rol.find().exec();
        if(!getRol){
            throw new httpError('Could not find any Rol',404)
        }
    }catch(err){
        return next(new httpError(`something went wrong ${err}`,404))
    }

    res.json({getRol})
}
//get a specific rol
const getRolById = async (req,res,next) => {
    const rolId = req.params.rId;
    let getRolById;

    try{
        getRolById = await Rol.findById(rolId)
        if(!getRolById){
            throw new httpError('Could not find any Rol',404)
        }
    }catch(err){
        return next(new httpError(`somenthing went wrong ${err}`,404))
    }

    res.status(201).json({getRolById})
}
//post a rol
const postRol = async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(new httpError('Invalid inputs passed, please check your data',422));
    }

    const {
        rolName
    } = req.body
    const createRol = new Rol({
        rolName,
        status:true
    })
    let noDuplicateName;

    try{
        noDuplicateName = await Rol.find({rolName:rolName})
        if(noDuplicateName.length === 1){
            throw new httpError('This Rol was already exist',404)
        }
        await createRol.save();
    }catch(err){
        return next(new httpError(`somenthing went wrong ${err}`,404))
    }

    res.status(201).json({message:"rol created successfully",createRol})
}
//patch a rol
const pathRol = async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(new httpError('Invalid inputs passed, please check your data',422));
    }

    const {
        rolName
    } = req.body
    const rolId = req.params.rId;
    let verifyRolById;

    try{
        const verifyName = await Rol.find({rolName:rolName})
        verifyRolById = await Rol.findById(rolId)

        if(!verifyRolById){
            throw new httpError('Could not find any rol',404)
        }
        if(verifyName.length === 1){
            throw new httpError('This specialty was already exist',404)
        }

        verifyRolById.rolName = rolName;
        await verifyRolById.save();

    }catch(err){
        return next(new httpError(`somenthing went wrong ${err}`,404))
    }

    res.status(201).json({message:'Rol updated!!',verifyRolById})
}
//delete a rol
const unactiveRol = async (req,res,next) => {
    const rolId = req.params.rId;
    let verifyRolById;

    try{
        verifyRolById = await Rol.findById(rolId)

        if(!verifyRolById){
            throw new httpError('Could not find any rol',404)
        }

        verifyRolById.status = false;
        await verifyRolById.save();

    }catch(err){
        return next(new httpError(`somenthing went wrong ${err}`,404))
    }

    res.status(201).json({message:'Rol unactive!!',verifyRolById})
}
//active a rol
const activeRol = async (req,res,next) => {
    const rolId = req.params.rId;
    let verifyRolById;

    try{
        verifyRolById = await Rol.findById(rolId)

        if(!verifyRolById){
            throw new httpError('Could not find any rol',404)
        }

        verifyRolById.status = true;
        await verifyRolById.save();

    }catch(err){
        return next(new httpError(`somenthing went wrong ${err}`,404))
    }

    res.status(201).json({message:'Rol active again!!',verifyRolById})
}

exports.getAllRoll = getAllRoll;
exports.getRolById = getRolById;
exports.postRol = postRol;
exports.pathRol = pathRol;
exports.unactiveRol = unactiveRol;
exports.activeRol = activeRol;