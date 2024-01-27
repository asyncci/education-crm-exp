import { Request, Response } from "express";
import { User } from "../../models/userModel";
import { config } from "../../../config";
import { sign } from "jsonwebtoken";

export async function addCurator(req: Request, res: Response) {
    const { email } = req.body;
    const user = await User.findOne({ 'email': email })

    if (user)
        return res.status(409).send({ success: false, error: 'User already exists' })

    const fields = { ...req.body, role: 'curator' };
    const curator = new User(fields)

    return await curator
        .save()
        .then((curatorObj) => {
            //send verification code
            const fields = {
                _id: curatorObj._id,
                email: curatorObj.email,
                role: curatorObj.role,
                verified: curatorObj.verified,
            }
            return res.send({ success: true, message: 'Curator registered', data: { curator: fields } })
        })
        .catch(() => res.status(500).send({ success: false, error: "Can't store user in database" }))
}

export async function deleteCurator(req: Request, res: Response) {
    const { id, email } = req.body;

    return await User.deleteOne({ $or: [{ _id: id }, { email: email }] })
        .then(() => res.send({ success: true, message: 'Curator deleted' }))
        .catch(() => res.status(500).send({ success: false, message: "Can't delete `curator` from database" }))
}