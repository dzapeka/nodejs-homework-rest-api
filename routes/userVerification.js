const express = require('express');
const UserController = require('../controllers/user');
const validateUserEmailVerification = require('../middlewares/validateUsersVerifyEmail');

const router = express.Router();
router.get('/verify/:verificationToken', UserController.verifyUserByToken);
router.post(
  '/verify',
  validateUserEmailVerification,
  UserController.sendVerification
);

module.exports = router;
