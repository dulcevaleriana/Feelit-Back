const httpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const Specialty = require('../models/specialty');

//get all specialty
const getAllSpecialty = async (req,res,next)=>{
    let getSpecialty;

    try {
        getSpecialty = await Specialty.find().exec();
        if(!getSpecialty){
            throw new httpError('Could not find any specialty',404)
        }
    } catch(err){
        return next(new httpError(`somenthing went wrong ${err}`,404))
    }

    res.json({getSpecialty})
};
//get specialty by id
const getSpecialtyById = async (req,res,next)=>{
    const specialtyId = req.params.sId;
    let getSpecialtyId;

    try {
        getSpecialtyId = await Specialty.findById(specialtyId);
        if(!getSpecialtyId){
            throw new httpError('Could not find any specialty',404)
        }
    } catch(err){
        return next(new httpError(`somenthing went wrong ${err}`,404))
    }

    res.status(201).json({getSpecialtyId})
};
//post a: specialty
const postSpecialty = async (req,res,next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(new httpError('Invalid inputs passed, please check your data',422));
    }
    const {specialtyName} = req.body;
    const createSpecialty = new Specialty({
        specialtyName,
        status:true
    })
    let verifyNotDuplicatedName;

    try {
        verifyNotDuplicatedName = await Specialty.find({specialtyName:specialtyName});
        if(verifyNotDuplicatedName.length === 1){
            throw new httpError('This specialty was already exist',404)
        }
        await createSpecialty.save();
    } catch(err){
        return next(new httpError(`somenthing went wrong ${err}`,404))
    }

    res.status(201).json({message:'Your specialty was create succesfully',createSpecialty});
}
//patch a: specialty
const patchSpecialty = async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(new httpError('Invalid inputs passed, please check your data',422));
    }
    const {specialtyName} = req.body;
    const specialtyId = req.params.sId;
    let verifyspecialtyId;

    try {
        const verifyNotDuplicatedName = await Specialty.find({specialtyName:specialtyName});
        verifyspecialtyId = await Specialty.findById(specialtyId);

        if(!verifyspecialtyId){
            throw new httpError('Could not find any specialty',404)
        }
        if(verifyNotDuplicatedName.length === 1){
            throw new httpError('This specialty was already exist',404)
        }

        verifyspecialtyId.specialtyName = specialtyName;
        await verifyspecialtyId.save();
    } catch(err){
        return next(new httpError(`somenthing went wrong ${err}`,404))
    }

    res.status(201).json({message:'Your specialty was modify succesfully',verifyspecialtyId});
}
//delete a: specialty
const deleteSpecialty = async (req,res,next) => {
    const specialtyId = req.params.sId;
    let deleteSpecialtyId;

    try {
        deleteSpecialtyId = await Specialty.findById(specialtyId);

        if(!deleteSpecialtyId){
            throw new httpError('Could not find any specialty',404)
        }

        deleteSpecialtyId.status = false;

        await deleteSpecialtyId.save();
    } catch(err){
        return next(new httpError(`somenthing went wrong ${err}`,404));
    }

    res.status(201).json({message:'your specialty was already canceled!',deleteSpecialtyId})
}
//active a: specialty
const activeSpecialty = async (req,res,next) => {
    const specialtyId = req.params.sId;
    let activeSpecialtyId;

    try {
        activeSpecialtyId = await Specialty.findById(specialtyId);

        if(!activeSpecialtyId){
            throw new httpError('Could not find any specialty',404)
        }

        activeSpecialtyId.status = true;

        await activeSpecialtyId.save();
    } catch(err){
        return next(new httpError(`somenthing went wrong ${err}`,404));
    }

    res.status(201).json({message:'your specialty was already actived!!!',activeSpecialtyId})
}

exports.getAllSpecialty = getAllSpecialty;
exports.getSpecialtyById = getSpecialtyById;
exports.postSpecialty = postSpecialty;
exports.patchSpecialty = patchSpecialty;
exports.deleteSpecialty = deleteSpecialty;
exports.activeSpecialty = activeSpecialty;