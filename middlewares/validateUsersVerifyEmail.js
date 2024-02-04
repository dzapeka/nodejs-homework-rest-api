const usersVerifyEmailSchema = require('../validations/verifyEmailValidation');

function validateUserEmailVerification(req, res, next) {
  const { error } = usersVerifyEmailSchema.validate(req.body);
  console.log(error);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

module.exports = validateUserEmailVerification;
