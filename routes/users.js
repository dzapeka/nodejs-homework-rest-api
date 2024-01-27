const express = require('express');

const UserController = require('../controllers/user');
const uploadMidleware = require('../middlewares/upload');
const resizeAvatar = require('../middlewares/resizeAvatar');

const router = express.Router();

router.get('/avatars', UserController.getAvatar);
router.patch(
  '/avatars',
  uploadMidleware.single('avatar'),
  resizeAvatar,
  UserController.uploadAvatar
);

module.exports = router;
