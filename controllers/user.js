const fs = require('node:fs/promises');
const path = require('node:path');

const User = require('../models/user');

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).send({ message: 'User not found' });
    }
    if (user.avatarURL === null) {
      return res.status(404).send({ message: 'Avatar not found' });
    }
    const avatarPath = path.join(
      __dirname,
      '..',
      'public/avatars',
      user.avatarURL
    );

    res.sendFile(avatarPath);
  } catch (error) {
    next(error);
  }
}

async function uploadAvatar(req, res, next) {
  try {
    let user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).send({ message: 'No file provided' });
    }
    try {
      await fs.rename(
        req.file.path,
        path.join(__dirname, '..', 'public', 'avatars', req.file.filename)
      );
    } catch (error) {
      console.error('Error renaming file:', error);
      return res.status(500).send({ message: 'Error uploading avatar' });
    }

    const oldAvatarURL = user.avatarURL;

    user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    );

    // remove old avatars
    if (oldAvatarURL !== null) {
      try {
        await fs.unlink(path.join(__dirname, '..', 'public', oldAvatarURL));
      } catch (e) {
        console.error('Old avatar file can not be deleted', e.message);
      }
    }

    res.send({
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAvatar, uploadAvatar };
