const {Router} = require('express');
const {check} = require('express-validator');
const router = Router();
const agendarCitaControllers = require('../controllers/agendarCita-controllers');

//get all agendar cita
router.get('/',agendarCitaControllers.getAllAgendarCita)
//get agendar cita by id
router.get('/:acId',agendarCitaControllers.getAgendarCitaById)
//get agendar cita by status
router.get('/status/:ToF',agendarCitaControllers.getAgendarCitaByStatus)
//get agendar cita by doctor
router.get('/doctor/:dId',agendarCitaControllers.getAgendarCitaByDoctor)
//get agendar cita by date
router.get('/date/:date',agendarCitaControllers.getAgendarCitaByDate)
//post a: agendar cita
router.post(
    '/createDate',
    [
        check('idPaciente').not().isEmpty(),
        check('idDoctor').not().isEmpty(),
        check('date').trim().isDate(),
        check('time').not().isEmpty(),
        check('messagePaciente').not().isEmpty(),
        check('doctorPrice').not().isEmpty()
    ],
    agendarCitaControllers.postAgendarCita)
//patch a: agendar cita
router.patch(
    '/:acId',
    [],
    agendarCitaControllers.patchAgendarCita)
//delete a: agendar cita with doctor's message
router.patch(
    '/desactive/:acId',
    [
        check('messageCancelDoctor').not().isEmpty()
    ],
    agendarCitaControllers.deleteAgendarCita)
//active a: agendar cita with doctor's message
router.patch(
    '/active/:acId',
    [
        check('messageCancelDoctor').not().isEmpty()
    ],
    agendarCitaControllers.activeAgendarCita)


module.exports = router;