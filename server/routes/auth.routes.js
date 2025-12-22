const Router = require("express")
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const config = require("config")
const jwt = require("jsonwebtoken")
const {check, validationResult} = require("express-validator")
const router = Router()
const authMiddleware = require('../middleware/auth.middleware')
const fileService = require('../services/fileService')
const File = require('../models/File')


router.post('/registration',
    [
        check("email", "Uncorect email").isEmail(),
        check("password", "Password most be longer than 6 and shorter than 12").isLength({min: 3, max: 10})
    ],
    async (req, res) => {

        console.log('res', req.body)

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Uncorrect request", errors});
            }

            const {email, password} = req.body

            const candidate = await User.findOne({email})

            if (candidate) {
                return res.status(400).json({message: `User with email ${email} already exists`})
            }

            const hashPassword = await bcrypt.hash(password, 8)

            const user = new User({email, password: hashPassword})
            await user.save()
            await fileService.createDir(new File({user:user.id, name: ''}))
            res.json({message: "User was created"})

        } catch (e) {
            console.log('error', e);
            res.send({message: 'Server error'});
        }
    })

router.post('/login',
    async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})

            if (!user) {
                return res.status(400).json({message: `User not find`})
            }

            const isPassValid = bcrypt.compareSync(password, user.password)
            if (!isPassValid) {
                return res.status(400).json({message: `Invalid password`})
            }

            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar,
                }
            })

        } catch (e) {
            console.log('error', e);
            res.send({message: 'Server error'});
        }
    })

router.get('/auth', authMiddleware,
    async (req, res) => {
        try {
            const user = await User.findOne({_id: req.user.id})
            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    })

module.exports = router;

