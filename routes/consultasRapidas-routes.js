const {Router} = require('express');
const {check} = require('express-validator');
const router = Router();
const consultasRapidasControllers = require('../controllers/consultasRapidas-controllers');

//get all consultas rapidas
router.get('/',consultasRapidasControllers.getAllconsultasRapidas)
//get consultas rapidas by id
router.get('/:crId',consultasRapidasControllers.getconsultasRapidasById)
//get consultas rapidas by status
router.get('/status/:ToF',consultasRapidasControllers.getconsultasRapidasByStatus)
//get consultas rapidas by doctor
router.get('/doctor/:dId',consultasRapidasControllers.getconsultasRapidasByDoctor)
//get consultas rapidas by paciente
router.get('/paciente/:pId',consultasRapidasControllers.getconsultasRapidasByPaciente)
//get consultas rapidas by doctor and paciente
router.get('/doctorAndPaciente/:dId/:pId',consultasRapidasControllers.getconsultasRapidasByDoctorAndPaciente)
//get consultas rapidas by date
router.get('/date/:date',consultasRapidasControllers.getconsultasRapidasByDate)
//post a: consultas rapidas
router.post(
    '/createConsultaRapida',
    [
        check('idPaciente').not().isEmpty(),
        check('idDoctor').not().isEmpty(),
        check('time').not().isEmpty(),
        check('messagePaciente').not().isEmpty(),
        check('doctorPrice').not().isEmpty()
    ],
    consultasRapidasControllers.postconsultasRapidas)
//patch a: consultas rapidas
router.patch(
    '/:crId',
    [
        check('idPaciente').not().isEmpty(),
        check('idDoctor').not().isEmpty()
    ],
    consultasRapidasControllers.patchconsultasRapidas)
//delete a: consultas rapidas with a message of Doctor
router.patch(
    '/desactive/:crId',
    [
        check('messageCancelDoctor').not().isEmpty()
    ],
    consultasRapidasControllers.deleteconsultasRapidas)
//active a: consultas rapidas with a message of Doctor
router.patch(
    '/active/:crId',
    [
        check('messageCancelDoctor').not().isEmpty()
    ],
    consultasRapidasControllers.activeConsultasRapidas)
//complete a: consultas rapidas with a message of Doctor
router.patch('/complete/:crId',consultasRapidasControllers.completeConsultasRapidas)

module.exports = router;