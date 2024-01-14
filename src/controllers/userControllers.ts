import { Request, Response } from "express";
import { User } from "../models/userModel";
import { sign } from "jsonwebtoken";
import { config } from "../../config";
import { comparePassword } from "../lib/core";

export async function signUp(req: Request, res: Response) {
    const { email, password, role } = req.body;

    if ( role === 'curator' ) 
        return res.status(400).send({ success: false, error: 'You can not register `curator`'})

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
            const token = sign(
                { user: { _id: userObj._id, email: userObj?.email || '', role: userObj.role } },
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

    const user = await User.findOne({ 'email': email })

    if (!user)
        return res.status(409).send({ success: false, error: 'Invalid Credentials' })


    const passwordString = typeof password == 'number' ? password.toString() : password;
    const validPassword = comparePassword(passwordString, user?.password!);

    if (!validPassword)
        return res.status(409).send({ success: false, error: 'Invalid Credentials' })


    const token = sign(
        { user: { _id: user._id, email: user.email || '', role: user.role } },
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
        profile: user.profile || null,
        role: user.role,
        token: token,
    };

    return res.status(202).send({ success: true, message: 'Logged in successfuly', data: data })
}