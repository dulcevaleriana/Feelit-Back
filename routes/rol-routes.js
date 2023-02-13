const {Router} = require('express');
const {check} = require('express-validator');
const router = Router();
const rolControllers = require('../controllers/rol-controllers');

//get all rol
router.get('/',rolControllers.getAllRoll)
//get a specific rol
router.get('/:rId',rolControllers.getRolById)
//post a rol
router.post(
    '/createRol',
    check('rolName').not().isEmpty(),
    rolControllers.postRol
)
//patch a rol
router.patch(
    '/:rId',
    check('rolName').not().isEmpty(),
    rolControllers.pathRol
)
//delete a rol
router.delete('/:rId',rolControllers.unactiveRol)
//active a rol
router.get('/active/:rId',rolControllers.activeRol)

module.exports = router;