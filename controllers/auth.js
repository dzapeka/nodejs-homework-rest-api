const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendVerificationEmail } = require('../helpers/sendEmail');
const { createAvatar } = require('../helpers/gravatar');

async function register(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user !== null) {
      return res.status(409).send({ message: 'Email in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const avatarFileName = await createAvatar(email);
    const avatarURL = `/avatars/${avatarFileName}`;

    const verificationToken = crypto.randomUUID();

    await sendVerificationEmail(email, verificationToken);

    const result = await User.create({
      email,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });

    res.status(201).send({
      user: {
        email: result.email,
        subscription: result.subscription,
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      return res.status(401).send({ message: 'Email or password is wrong' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: 'Email or password is wrong' });
    }

    if (user.verify === false) {
      return res.status(403).send({ message: 'Email not verified' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '2 days' }
    );

    await User.findByIdAndUpdate(user._id, {
      token,
    });

    res.send({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  try {
    const currentUser = await User.findById(req.user.id);

    res.send({
      email: currentUser.email,
      subscription: currentUser.subscription,
      avatarURL: currentUser.avatarURL,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, current };
