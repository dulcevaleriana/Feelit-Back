const {Router} = require('express');
const {check} = require('express-validator');
const router = Router();
const specialtyControllers = require('../controllers/specialty-controllers');

//get all specialty
router.get('/',specialtyControllers.getAllSpecialty)
//get specialty by id
router.get('/:sId',specialtyControllers.getSpecialtyById)
//post a: specialty
router.post('/createSpecialty',check('specialtyName').not().isEmpty(),specialtyControllers.postSpecialty)
//patch a: specialty by patience
router.patch('/:sId',check('specialtyName').not().isEmpty(),specialtyControllers.patchSpecialty)
//delete a: specialty
router.delete('/:sId',specialtyControllers.deleteSpecialty)
//active a: specialty
router.get('/active/:sId',specialtyControllers.activeSpecialty)

module.exports = router;