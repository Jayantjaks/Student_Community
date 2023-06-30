const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.get('googleClientID'));
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Id = require('../../models/Id');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      if (!user.password) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid login method' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);
router.post('/google', async (req, res) => {
  const token = req.body.token;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.get('googleClientID')
    });
    const googleData = ticket.getPayload();
    let user = await User.findOne({ email: googleData.email });
    if (!user) {
      let userAllowed = await Id.findOne({ email: googleData.email });
      if (!userAllowed) {
        res
          .status(400)
          .json({ errors: [{ msg: "You can't register with this email" }] });
      }
      if (userAllowed) {
        const newUser = new User({
          name: googleData.name,
          email: googleData.email,
          avatar: googleData.picture
        });
        user = await newUser.save();
        res.json({ _id: user?._id, status: 'ok' });
      }
    }
    const payload = {
      user: {
        id: user?.id
      }
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
router.post('/id', async (req, res) => {
  const collegeId = req.body.id;
  const userid = req.body.userid;
  try {
    const user = await User.findOne({ _id: userid });
    const userAllowed = await Id.findOne({ id: collegeId, email: user.email });
    if (!userAllowed) {
      res.status(400).json({ errors: [{ msg: 'Id is invalid' }] });
    }
    if (userAllowed) {
      await User.findOneAndUpdate({ _id: userid }, { collegeId: collegeId });
      await Id.deleteOne({ id: collegeId });
      if (user) {
        const payload = {
          user: {
            id: user.id
          }
        };

        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: '5 days' },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
module.exports = router;
