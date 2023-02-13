const httpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const Paciente = require('../models/paciente');
const ConsultasRapidas = require('../models/consultasRapidas');
const EnviarExamenes = require('../models/enviarExamenes');
const AgendarCita = require('../models/agendarCita');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//get all paciente
const getAllPaciente = async (req,res,next)=>{
    let getAllPaciente;

    try{
        getAllPaciente = await Paciente.find().exec();
    } catch(error){
        return res.json({message:'Could not find any paciente'})
    }

    res.json({getAllPaciente:getAllPaciente.map(data => data.toObject({getters:true}))})
};
//get paciente by id
const getPacienteById = async (req,res,next) => {
    const pacienteId = req.params.pId;
    let getPacienteById;

    try {
        getPacienteById = await Paciente.findById(pacienteId);
    } catch(err){
        return next(new httpError('we can`t find this paciente',500));
    }

    res.json({getPacienteById:getPacienteById.toObject({getters:true})})
};
//get all paciente's services
const getAllPacienteServices = async (req,res,next) => {
    const pacienteId = req.params.pId;
    let getConsultasRapida;
    let getAgendarCita;
    let getEnviarResultados;
    let getAllServices;

    try {
        getConsultasRapida = await ConsultasRapidas.find({idPaciente:pacienteId});
        getAgendarCita = await AgendarCita.find({idPaciente:pacienteId});
        getEnviarResultados = await EnviarExamenes.find({idPaciente:pacienteId});

        if(getConsultasRapida.length === 0 && getAgendarCita.length === 0  && getEnviarResultados.length === 0){
            throw new httpError(`this paciente doesn't create any services yet`,404)
        }

        getAllServices = [
            ...getConsultasRapida,
            ...getAgendarCita,
            ...getEnviarResultados
        ]
    } catch(err){
        return next(new httpError(`somethign went wrong ${err}`,422));
    }

    res.status(201).json({getAllServices})
}
//post a doctor
const postPaciente = async (req,res,next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(new httpError('Invalid inputs passed, please check your data',422));
    }
    const {
        cedula,
        email,
        password,
        telefono,
        name
    } = req.body;

    let hashPassword;

    try{
        hashPassword = await bcrypt.hash(password, 12);
    } catch(err){
        return next(new httpError('Could not create Doctor, please try again',500));
    }

    const createPaciente = new Paciente({
        cedula,
        email,
        password: hashPassword,
        telefono,
        name,
        status:true,
        rol:'638f3ddd1af87455b52cf7d7'
    })

    try {
        const ifCedulaExist = await Paciente.findOne({cedula:cedula});
        const ifEmailExist = await Paciente.findOne({email:email});

        if(ifCedulaExist){
            throw new httpError(`a user with this cedula: ${cedula} is already exist`,322)
        }
        if(ifEmailExist){
            throw new httpError(`a user with this email: ${email} is already exist`,322)
        }

        createPaciente.save();
    } catch (err) {
        return next(new httpError(`something went wrong ${err}`,500))
    }

    let token;
    try {
        token = jwt.sign(
            {
                pacienteId: createPaciente.id,
                email: createPaciente.email,
                rol: createPaciente.rol
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1h'
            }
        );
    } catch(err){
        return next(new httpError('Could not create user, please try again',400));
    }

    res.status(201).json({pacienteId: createPaciente.id, email: createPaciente.email, rol: createPaciente.rol, token: token});
}
//patch a doctor
const patchPaciente = async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(new httpError('Invalid inputs passed, please check your data',422));
    }
    const {
        cedula,
        email,
        password,
        telefono,
        name,
        paymentMethod
    } = req.body;
    const pacienteId = req.params.pId;
    let updatePaciente;
    let hashPassword;

    try{
        hashPassword = await bcrypt.hash(password, 12);
    } catch(err){
        return next(new httpError('Could not create Doctor, please try again',500));
    }

    try{
        updatePaciente = await Paciente.findById(pacienteId);

        if(updatePaciente.status === false){
            return next(new httpError(`We can't modify a paciente inactive`,500));
        }

        updatePaciente.cedula = cedula;
        updatePaciente.email = email;
        updatePaciente.password = hashPassword;
        updatePaciente.telefono = telefono;
        updatePaciente.name = name;
        updatePaciente.paymentMethod = paymentMethod;

        await updatePaciente.save();
    } catch (err){
        return next(new httpError(`something went wrong ${err}`,500))
    }

    res.status(201).json({message:'paciente`s account was succesfull edited:',updatePaciente})
}
//delete a paciente
const deletePaciente = async (req,res,next) => {
    const pacienteId = req.params.pId;
    let setDoctorStatusFalse;

    try{
        setDoctorStatusFalse = await Paciente.findById(pacienteId);
        setDoctorStatusFalse.status = false;
        setDoctorStatusFalse.save();
    } catch(err){
        return next(new httpError(`something went wrong ${err}`,500))
    }

    res.status(201).json({message:`doctor's account was succesfull off, now it status is: ${setDoctorStatusFalse.status}: `,setDoctorStatusFalse:setDoctorStatusFalse.toObject({getters:true})})
}
//active a paciente
const activePaciente = async (req,res,next) => {
    const pacienteId = req.params.pId;
    let setDoctorStatusTrue;

    try{
        setDoctorStatusTrue = await Paciente.findById(pacienteId);
        setDoctorStatusTrue.status = true;
        setDoctorStatusTrue.save();
    } catch(err){
        return next(new httpError(`something went wrong ${err}`,500))
    }

    res.status(201).json({message:`doctor's account was succesfull active again, now it status is: ${setDoctorStatusTrue.status}: `,setDoctorStatusTrue:setDoctorStatusTrue.toObject({getters:true})})
}
//login paciente
const loginPaciente = async (req,res,next) => {
    const {
        email,
        password,
    } = req.body;
    let loginPaciente;

    try {
        loginPaciente = await Paciente.findOne({email:email})

        if(!loginPaciente){
            return next(new httpError(`we can't find a paciente with this email`,404))
        }

        if(loginPaciente.status === false){
            return next(new httpError(`this paciente was delete, if you want to active again please contact us by email info@feelit.com`,404))
        }

    } catch(err){
        return next(new httpError(`something went wrong ${err}`,500))
    }

    let isValidPassword;
    try {
        isValidPassword = await bcrypt.compare(password, loginPaciente.password);
    } catch(err){
        return next(new httpError(`login failed, review your credentials and try again ${err}`,500))
    }

    if(!isValidPassword){
        return next(new httpError(`login failed, review your credentials and try again`,400))
    }

    let token;
    try {
        token = jwt.sign(
            {
                pacienteId: loginPaciente.id,
                email: loginPaciente.email,
                rol: loginPaciente.rol
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1h'
            }
        );
    } catch(err){
        return next(new httpError('Could not create user, please try again',400));
    }


    res.json({pacienteId: loginPaciente.id,email: loginPaciente.email,rol: loginPaciente.rol,token:token})
}

exports.getAllPaciente = getAllPaciente;
exports.getPacienteById = getPacienteById;
exports.postPaciente = postPaciente;
exports.patchPaciente = patchPaciente;
exports.deletePaciente = deletePaciente;
exports.loginPaciente = loginPaciente;
exports.activePaciente = activePaciente;
exports.getAllPacienteServices = getAllPacienteServices;