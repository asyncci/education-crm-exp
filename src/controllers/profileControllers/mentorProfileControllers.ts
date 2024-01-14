import { Request, Response } from "express";
import { User } from "../../models/userModel";
import { MentorProfile } from "../../models/profileModel";

export async function createMentorProfile(req: Request, res: Response) {
    const { authorization } = req.headers;
    const user = await User.findOne({ token: (authorization!) })
    const body = req.body;

    if (user) {
        const { profile, role } = user;

        if (role !== 'mentor')
            return res.status(403).send({ success: false, error: "You can't sign to mentor data", message: `Your role is ${role}` })

        const isProfile = await MentorProfile.findById(profile);
        
        if ( isProfile )
            return res.status(400).send({ success: false, error: 'Profile already exsists'})

        const { body } = req;
        const newProfile = new MentorProfile(body);
        return await newProfile
            .save()
            .then(async (profileObj) => {
                await User.updateOne({ _id: user._id }, { $set: { profile: profileObj._id } })
                    .catch(() => {
                        return res.status(500).send({ success: false, error: "Can't update user profile in database" })
                    })

                return res.status(200).send({ success: true, message: 'Successfuly created profile', data: { profile: profileObj } })
            })
            .catch(() => res.status(500).send({ success: false, error: "Can't save profile to database" }))
    }
    else
        return res.status(404).send({ success: false, error: 'User not found' })
}

export async function updateMentorProfile(req: Request, res: Response) {
    const { authorization } = req.headers;
    const user = await User.findOne({ token: (authorization!) })
    const body = req.body;

    if (user) {
        const { profile, role } = user;

        if (role !== 'mentor')
            return res.status(403).send({ success: false, error: "You can't sign to mentor data", message: `Your role is ${role}` })


        ///FIND AND UPDATE
        return await MentorProfile.findOneAndUpdate({ _id: profile }, body, { new: true })
            .then(async (doc) => {
                if (doc)
                    return res.status(200).send({ success: true, message: 'Successfuly updated profile', data: { profile: doc } })
                else 
                    return res.status(400).send({ success: false, error: "Profile doesn't exist" })
            })
    }
    else
        return res.status(404).send({ success: false, error: 'User not found' })
}

export async function deleteMentorProfile(req: Request, res: Response) {
    const { authorization } = req.headers;
    const user = await User.findOne({ token: (authorization!) })

    if (user) {
        //profile is 'profile ID'
        const { profile } = user;
        return await MentorProfile.deleteOne({ _id: profile })
            .then(() => res.send({success: true, message: 'Profile was deleted'}))
            .catch(() => res.status(500).send({ success: false, error: "Can't delete profile"}))
    }
    else {
        return res.status(404).send({ success: false, error: 'No profile'})
    }
}
export async function getMentor(req: Request, res: Response) {
    const { profileId } = req.params
    const profile = await MentorProfile.findById(profileId)

    if (!profile)
        return res.status(404).send({ success: false, error: 'No Data' })

    return res.send({ success: true, message: 'Successfuly got mentor profile', data: profile })
}

export async function getAllMentors(req: Request, res: Response) {
    const profiles = await MentorProfile.find({})

    if (!profiles)
        return res.status(404).send({ success: false, error: 'No Data' })

    return res.send({ success: true, message: 'Successfuly got mentor profiles', data: profiles })
}
