const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const User = require('../models/user');
const { sendVerificationEmail } = require('../helpers/sendEmail');

async function getAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).send({ message: 'User not found' });
    }
    if (user.avatarURL === null) {
      return res.status(404).send({ message: 'Avatar not found' });
    }

    const avatarPath = path.join(__dirname, '..', 'public', user.avatarURL);

    if (!fs.existsSync(avatarPath)) {
      return res.status(404).send({ message: 'Avatar not found' });
    }

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
      await fs.renameSync(
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
        await fs.unlinkSync(path.join(__dirname, '..', 'public', oldAvatarURL));
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

async function verifyUserByToken(req, res, next) {
  const verificationToken = req.params.verificationToken;

  try {
    const user = await User.findOne({ verificationToken });
    if (user === null) {
      return res.status(404).send({ message: 'User not found' });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.send({ message: 'Verification successful' });
  } catch (e) {
    next(e);
  }
}

async function sendVerification(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: 'Verification has already been passed' });
    }

    const verificationToken = crypto.randomUUID();

    await sendVerificationEmail(email, verificationToken);

    await User.findByIdAndUpdate(user._id, {
      verificationToken,
    });

    res.send({ message: 'Verification email sent' });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getAvatar,
  uploadAvatar,
  verifyUserByToken,
  sendVerification,
};
