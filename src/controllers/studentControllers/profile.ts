import { Request, Response } from "express";
import { User } from "../../models/userModel";
import { StudentProfile } from "../../models/profileModel";


export async function createStudentProfile(req: Request, res: Response) {
    const user = res.locals.user;
    const isProfile = await StudentProfile.findById(user.profile);

    if (isProfile)
        return res.status(400).send({ success: false, error: 'Profile already exists' });

    const { body } = req;
    const newProfile = new StudentProfile(body);

    try {
        const savedProfile = await newProfile.save();
        await User.updateOne({ _id: user._id }, { $set: { profile: savedProfile._id } });

        return res.status(200).send({
            success: true,
            message: 'Successfully created profile',
            data: { profileId: savedProfile._id }
        });
    } catch (error) {
        console.error('Error saving profile:', error);
        return res.status(500).send({
            success: false,
            error: "Can't save profile to database"
        });
    }
}

export async function updateStudentProfile(req: Request, res: Response) {
    const user = res.locals.user;

    return await StudentProfile.findOneAndUpdate({ _id: user.profile }, req.body, { new: true })
        .then(async (doc) => {
            if (doc)
                return res.status(200).send({ success: true, message: 'Successfully updated profile', data: { profile: doc } })
            else
                return res.status(400).send({ success: false, error: "Profile doesn't exist" })
        })
}

export async function deleteStudentProfile(req: Request, res: Response) {
    const { profile } = res.locals.user;
    return await StudentProfile.deleteOne({ _id: profile })
        .then(() => res.send({ success: true, message: 'Profile was deleted' }))
        .catch(() => res.status(500).send({ success: false, error: "Can't delete profile" }))

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
