import userDataModel from "../models/userModel"

const bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken')
var JWT_SECRET = process.env.JWT_SECRET

exports.userRegister = async (req: any, res: any, next: any) => {
    const { username, email, password } = req.body;

    const checkEmail = await userDataModel.findOne({ email: email })
    const checkUser = await userDataModel.findOne({ username: username })

    if (checkEmail || checkUser) {
        return res.status(409).json({ message: "Account already exist", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt)
    userDataModel.create({
        username: username,
        email: email,
        password: secPass
    })

    return res.status(200).json({ message: "Account Created", success: true })
}

exports.userLogin = async (req: any, res: any, next: any) => {
    const { email, password } = req.body;

    const user = await userDataModel.findOne({ email: email })
    if (!user) return res.status(401).send({ message: "Invalid Credentials", success: false })

    const checkPass = await bcrypt.compare(password, user.password)
    if (!checkPass) return res.status(401).send({ message: "Invalid Credentials", success: false })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('__chatApp__', token, {
        sameSite:'none',
        httpOnly: true, 
        path: '/',
        secure: true,   // true in production with HTTPS
        expires: new Date(new Date().getTime() + 60 * 60 * 1000), //1hr
    });

    return res.status(200).json({ message: "Login Success", success: true })
}