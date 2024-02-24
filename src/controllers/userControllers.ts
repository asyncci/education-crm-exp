import { Request, Response, response } from "express";
import { User } from "../models/userModel";
import { sign } from "jsonwebtoken";
import { config } from "../../config";
import { comparePassword } from "../lib/core";

export async function signUp(req: Request, res: Response) {
    const { email, password, role } = req.body;

    if (!email|| !password || !role) 
        return res.status(403).send("send filled normal request")

    const user = await User.findOne({ 'email': email })
    if (user)
        return res.status(409).send({ success: false, error: 'User already exists' })

    let userData = new User()
    userData.email = email
    userData.password = typeof password === 'number' ? password.toString() : password
    userData.role = role

    return await userData
        .save()
        .then(async (userObj) => {
            let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            const token = sign(
                { user: { _id: userObj._id, email: userObj?.email || '', role: userObj.role }, ip: ip },
                config.secretKey,
                { expiresIn: config.expiresIn }
            )

            await User.updateOne({ _id: userObj._id }, { $set: { token: token } })
                .catch(() => {
                    return res.status(500).send({
                        success: false,
                        error: "Can't save user to database"
                    })
                })

            const data = {
                _id: userObj._id,
                email: userObj.email,
                profile: userObj.profile || null,
                role: userObj.role,
                token: token,
            };
            return res.status(201).send({ success: true, message: 'User created', data: data })
        })
        .catch(() => {
            return res.status(500).send({
                success: false,
                error: 'Database cannot register user'
            })
        })
}

export async function signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email|| !password) 
        return res.status(403).send("send filled normal request")

    const user = await User.findOne({ email })

    if (!user)
        return res.status(409).send({ success: false, error: 'Invalid Credentials' })

    const validPassword = comparePassword(password, user?.password!);

    if (!validPassword)
        return res.status(409).send({ success: false, error: 'Invalid Credentials' })

    const token = sign(
        { user: { _id: user._id, email: user.email || '', role: user.role }},
        config.secretKey,
        { expiresIn: config.expiresIn }
    )

    await User.updateOne({ _id: user._id }, { $set: { token } })
        .catch(() => {
            return res.status(500).send({
                success: false,
                error: "Can't save User's `token` field to database"
            })
        })

    const data = {
        _id: user._id,
        email: user.email,
        profile: user.profile,
        role: user.role,
        token: token,
    };

    return res.status(202).send({ success: true, message: 'Logged in successfully', data: data })
}