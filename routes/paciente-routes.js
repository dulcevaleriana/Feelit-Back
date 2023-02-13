const {Router} = require('express');
const {check} = require('express-validator');
const router = Router();
const pacienteControllers = require('../controllers/paciente-controllers');

//get all paciente
router.get('/',pacienteControllers.getAllPaciente)
//get paciente by id
router.get('/:pId',pacienteControllers.getPacienteById)
//get all paciente's services
router.get('/getAllPacienteServices/:pId',pacienteControllers.getAllPacienteServices)
//post a paciente
router.post(
    '/createPaciente',
    [
        check('name').not().isEmpty(),
        check('cedula').isLength({min:13}),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min:6}),
        check('telefono').isLength({min:12}),
    ],
    pacienteControllers.postPaciente)
//patch a paciente
router.patch(
    '/:pId',
    // [
    //     check('name').not().isEmpty(),
    //     check('cedula').isLength({min:13}),
    //     check('email').normalizeEmail().isEmail(),
    //     check('password').isLength({min:6}),
    //     check('telefono').isLength({min:12}),
    // ],
    pacienteControllers.patchPaciente)
//delete a paciente
router.delete('/:pId',pacienteControllers.deletePaciente)
//active a paciente
router.get('/activePaciente/:pId',pacienteControllers.activePaciente)
//login paciente
router.post('/login',pacienteControllers.loginPaciente)


module.exports = router;