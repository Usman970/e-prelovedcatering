const express = require('express');
const middleware = require('../../Functions/Middlewares');
const Controller = require('./controller');

const router = express.Router();

router.post('/', Controller.Create);
router.post('/login', Controller.Login);
router.post('/sociallogin', Controller.socialLogin);
router.get('/', middleware.authenticateToken, Controller.List);
router.patch('/switch', middleware.authenticateToken, Controller.SwitchProfile);
router.post('/forgotpassword', Controller.forgotPassword);
// router.post('/changepassword', middleware.decryptPasswordToken, Controller.changePassword);
router.post('/verify', middleware.authenticateToken, Controller.Verify);
router.get('/:id', middleware.authenticateToken, Controller.View);
router.patch('/:id', middleware.authenticateToken, Controller.Update);
router.delete('/:id', middleware.authenticateToken, Controller.Remove);
router.patch('/updatepassword/:id', middleware.authenticateToken, Controller.updatePassword);
router.patch('/register/:token', Controller.updatePasswordByLink);
router.patch('/personalinfo/:id', middleware.authenticateToken, Controller.updatePersonalInfo);
router.patch('/professionalinfo/:id', middleware.authenticateToken, Controller.updateProfesionalInfo);
router.patch('/personalinfo/:id', middleware.authenticateToken, Controller.updateLinkedAccounts);

module.exports = router;