import { Router } from "express";
import userDataModel from "../models/userModel";
const router = Router();

const userController = require('../controllers/userController')

router.post('/register', userController.userRegister)

router.post('/login', userController.userLogin)

router.get('/all', async (req: any, res: any) => {
    const allUsers = await userDataModel.find().select(['username'])
    return res.status(200).json({ message: `All Avaliable Users`, success: true, allUsers })
})

router.get('/profile', (req: any, res: any) => {
    return res.status(200).json({ message: `User logged In`, success: true, user: req.user })
})

router.get('/logout', async (req: any, res: any) => {
    res.cookie('__chatApp__', '', {
        sameSite:'none',
        httpOnly: true,
        path: '/',
        secure: true,
        expires: new Date(0)
    });
    res.status(200).send({ message: "Logged out", success: true })
})

module.exports = router;