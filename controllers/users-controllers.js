const httpError = require('../models/http-error');
const {validationResult} = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//get all users
const getUsers = async (req,res,next) => {
    let users;
    try{
        users = await User.find({}, '-password').exec();
    } catch(err){
        return next(new httpError(`fetching users failed, try again: ${err}`,500));
    }
    res.json({users})
}
//get all Users's Email And Password
const getUsersEmailAndPassword = async (req,res,next) => {
    let users;

    try {
        users = await User.find({},'-password');
    } catch (err) {
        return next(new httpError(`fetching users failed, try again: ${err}`,500));
    }

    res.json({users: users.map(users => users.toObject({getters:true}))});
}
//post a user
const signUpUsers = async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(new httpError('Invalid inputs passed, please check your data',422));
    }

    const {
        name,
        email,
        password,
    } = req.body;

    let existingUser;
    let hashPassword;

    try{
        hashPassword = await bcrypt.hash(password, 12);
    } catch(err){
        return next(new httpError('Could not create user, please try again',500));
    }

    const createUser = new User({
        name,
        email,
        password: hashPassword,
        image: req.file.path,
        places:[]
    });

    try {
        existingUser = await User.findOne({email: email})
        if(existingUser){
            return next(new httpError(`this email: ${email} was register by other user, try again`,422))
        }
        await createUser.save();
    } catch (err) {
        return next(new httpError(`we can't create this user, try again: ${err}`,500))
    }

    let token;
    try {
        token = jwt.sign(
            {
                userId: createUser.id,
                email: createUser.email
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1h'
            }
        );
    } catch(err){
        return next(new httpError('Could not create user, please try again',400));
    }

    res.status(200).json({userId: createUser.id, email: createUser.email, token: token})
}
//login with a exist account
const login = async (req,res,next) => {
    const {
        email,
        password
    } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({email: email})
        if(!existingUser){
            return next(new httpError(`your credentials are incorrect, try again`,422))
        }
    } catch (err) {
        return next(new httpError(`login failed, try again ${err}`,500))
    }

    let isValidPassword;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
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
                userId: existingUser.id,
                email: existingUser.email
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1h'
            }
        );
    } catch(err){
        return next(new httpError('Login fail, please try again',500));
    }

    res.json({userId: existingUser.id,email: existingUser.email, token: token})
}

exports.getUsers = getUsers;
exports.getUsersEmailAndPassword = getUsersEmailAndPassword;
exports.signUpUsers = signUpUsers;
exports.login = login;