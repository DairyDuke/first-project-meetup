const express = require('express')

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

router.post(
  '/',
  validateLogin,
  // May need middleware to check if user is already loged in
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (!user) {
      const err = new Error('Login failed');
      err.statusCode = 401;
      err.title = 'Login failed';
      err.message = 'Invalid credentials'
      err.errors = 'The provided credentials were invalid.';
      return next(err);
    }

    user.token = await setTokenCookie(res, user);

    // --- In an effort to give the user a .token I commented out the below for line 40.
    //raw = true in a query to allow manipulation otherwise
    // user.token = token
    // const tokenUser = await user.toJSON()
    // tokenUser.token = token
    // //user
    return res.json({user});
  }
);

router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

router.get(
  '/',
  restoreUser,
  // requireAuth, --- This was blocking things. Need to figure out if this is needed or not.
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json(user.toSafeObject());
    } else return res.json({});
  }
);


module.exports = router;
