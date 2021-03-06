const router = require('express').Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const keys = require('../../config/keys')

// Load Input Validation
const validateRegisterInput = require('../../validation/user/register')
const validateLoginInput = require('../../validation/user/login')

// Load User Model
const User = require('../../models/User')

// @route   GET api/users/test
// @desc    Tests user route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users routes works' }))

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors)
    }
    User.findOne()
        .or([{ email: req.body.email }, { username: req.body.username }])
        .then(user => {
            if (user) {
                errors.usernameOrEmail = 'Username or email already exists'
                return res.status(400).json(errors)
            }
            else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg', // Rating
                    d: 'mm' // Default
                });

                const newUser = new User({
                    name: req.body.name,
                    username: req.body.username,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})

// @route   GET api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
    const {errors, isValid} = validateLoginInput(req.body)

    // Check Validation
    if(!isValid){
        return res.status(400).json(errors)
    }

    const usernameOrEmail = req.body.usernameOrEmail
    const password = req.body.password

    // Find user by username or email
    User.findOne()
        .or([{ email: usernameOrEmail }, { username: usernameOrEmail }])
        .then(user => {
            if (!user) {
                errors.usernameOrEmail = 'User not found'
                return res.status(404).json(errors)
            }

            // Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User Matched
                        const payload = { id: user.id, name: user.name, username: user.username, avatar: user.avatar }; //Create JWT Payload

                        // Sign Token
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            res.json({
                                success: true,
                                token: `Bearer ${token}`
                            });
                        });
                    }
                    else {
                        errors.password = 'Wrong password'
                        return res.status(400).json(errors)
                    }
                })
        })
        .catch(err => console.log(err))
})

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('user', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email
    })
})

module.exports = router