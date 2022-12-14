const express = require('express')
const { setTokenCookie, requireAuth, uniqueUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First name can not be blank.')
    .isLength({ min: 2 })
    .withMessage('Please provide a first name with at least 2 characters.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last name can not be blank.')
    .isLength({ min: 2 })
    .withMessage('Please provide a last name with at least 2 characters.'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Email can not be blank')
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Username can not be blank.')
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password can not be blank.')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// User Signup
router.post(
  '/',
  validateSignup,
  uniqueUser,
  async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;
    const user = await User.signup({ firstName, lastName, email, username, password });

    const token = await setTokenCookie(res, user);
    const tokenUser = user.toJSON()
    tokenUser.token = token
    return res.json({
      // user
      ...tokenUser
    });

  })

module.exports = router;
// Notes
// In the route handler, call the signup static method on the User model.
// If the user is successfully created, then call setTokenCookie and return
// a JSON response with the user information. If the creation of the user is
// unsuccessful, then a Sequelize Validation error will be passed onto the
// next error-handling middleware.
// router.post(
//   '/',
//   async (req, res) => {
//     const { email, password, username } = req.body;
//     const user = await User.signup({ email, username, password });

//     await setTokenCookie(res, user);

//     return res.json({
//       user
//     });
//   }
// );
