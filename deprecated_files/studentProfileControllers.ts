import { Request, Response } from "express";
import {StudentProfile} from "../src/models/profileModel.ts";
import {User} from "../src/models/userModel.ts";


export async function createStudentProfile(req: Request, res: Response) {
    const { authorization } = req.headers;
    const user = await User.findOne({ token: (authorization!) })

    if (user) {
        const { profile, role } = user;

        if (role !== 'student')
            return res.status(403).send({ success: false, error: "You can't sign to student data", message: `Your role is ${role}` })

        const isProfile = await StudentProfile.findById(profile);

        if (isProfile)
            return res.status(400).send({ success: false, error: 'Profile already exists' })

        const { body } = req;
        const newProfile = new StudentProfile(body);
        return await newProfile
            .save()
            .then(async (profileObj:any) => {
                await User.updateOne({ _id: user._id }, { $set: { profile: profileObj._id } })
                    .catch(() => {
                        return res.status(500).send({ success: false, error: "Can't update user profile in database" })
                    })

                return res.status(200).send({ success: true, message: 'Successfully created profile', data: { profile: profileObj } })
            })
            .catch(() => res.status(500).send({ success: false, error: "Can't save profile to database" }))
    }
    else
        return res.status(404).send({ success: false, error: 'User not found' })
}

export async function updateStudentProfile(req: Request, res: Response) {
    const { authorization } = req.headers;
    const user = await User.findOne({ token: (authorization!) })
    const body = req.body;

    if (user) {
        const { profile, role } = user;

        if (role !== 'student')
            return res.status(403).send({ success: false, error: "You can't sign to student data", message: `Your role is ${role}` })


        ///FIND AND UPDATE
        return await StudentProfile.findOneAndUpdate({ _id: profile }, body, { new: true })
            .then(async (doc:any) => {
                if (doc)
                    return res.status(200).send({ success: true, message: 'Successfully updated profile', data: { profile: doc } })
                else
                    return res.status(400).send({ success: false, error: "Profile doesn't exist" })
            })
    }
    else
        return res.status(404).send({ success: false, error: 'User not found' })
}

export async function deleteStudentProfile(req: Request, res: Response) {
    const { authorization } = req.headers;
    const user = await User.findOne({ token: (authorization!) })

    if (user) {
        //profile is 'profile ID'
        const { profile } = user;
        return await StudentProfile.deleteOne({ _id: profile })
            .then(() => res.send({ success: true, message: 'Profile was deleted' }))
            .catch(() => res.status(500).send({ success: false, error: "Can't delete profile" }))
    }
    else {
        return res.status(404).send({ success: false, error: 'No profile' })
    }
}
export async function getStudent(req: Request, res: Response) {
    const { profileId } = req.params
    const profile = await StudentProfile.findById(profileId)

    if (!profile)
        return res.status(404).send({ success: false, error: 'No Data' })


    return res.send({ success: true, message: 'Successfully got student profile', data: profile })
}
export async function getAllStudents(req: Request, res: Response) {
    const profiles = await StudentProfile.find({})

    if (!profiles)
        return res.status(404).send({ success: false, error: 'No Data' })

    return res.send({ success: true, message: 'Successfully got student profiles', data: profiles })
}
