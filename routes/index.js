const express = require('express');

const router = express.Router();

const contactsRouter = require('./contacts');
const authRouter = require('./auth');
const usersRouter = require('./users');

const authMiddleware = require('../middlewares/auth');

router.use('/users', authRouter);
router.use('/users', authMiddleware, usersRouter);
router.use('/api/contacts', authMiddleware, contactsRouter);

module.exports = router;
