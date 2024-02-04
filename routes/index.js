const express = require('express');

const router = express.Router();

const contactsRouter = require('./contacts');
const authRouter = require('./auth');
const usersRouter = require('./users');
const userVerificationRouter = require('./userVerification');

const authMiddleware = require('../middlewares/auth');

router.use('/contacts', authMiddleware, contactsRouter);
router.use('/users', authRouter); // Register, login, logout
router.use('/users', userVerificationRouter); // Verify user by email
router.use('/users', authMiddleware, usersRouter); // Avatars for current user

module.exports = router;
