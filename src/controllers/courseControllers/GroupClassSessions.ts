import { Request, Response } from "express";
import {GroupClass, GroupClassSession} from "../../models/coursesModels";

//get all
export async function groupClassSessions(req: Request, res: Response) {
    // const groupClassSessions = await GroupClassSession.find({});
    // return res.send({ success: true, data: { groupClassSessions: groupClassSessions } })
//This includes check that student has access to session:
    try {
        const groupSessions = await GroupClassSession.find({});
        const user = res.locals.user;
        if (user.role === 'student') {
            const accessibleSessions = groupSessions.filter(groupSession =>
                groupSession.attendance?.some(attendance => attendance?.student?.toString() === user.profile.toString())
            );

            return res.send({ success: true, data: { groupSessions: accessibleSessions } });
        } else {
            return res.send({ success: true, data: { groupSessions: groupSessions } });
        }
    } catch (error) {
        console.error('Error fetching group classes:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

//get one group class session
export async function groupClassSession(req: Request, res: Response) {
    // const groupClassSession = await GroupClassSession.find({ _id: req.params.id });
    // return res.send({ success: true, data: { groupClassSession: groupClassSession } })
//This includes check that student has access to session:
    try {
        const groupSession = await GroupClassSession.findOne({ _id: req.params.id });
        if (!groupSession) {
            return res.status(404).json({ success: false, error: 'Group session not found' });
        }
        const user = res.locals.user;
        if (user.role === 'student') {
            const isAccessible = groupSession.attendance?.some(attendance => attendance?.student?.toString() === user.profile.toString());
            if (!isAccessible) {
                return res.status(403).json({ success: false, error: 'You are not authorized to access this group session' });
            }
        }
        return res.send({ success: true, data: { groupSessions: [groupSession] } });

    } catch (error) {
        console.error('Error fetching group classes:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }

}

//create group class session
export async function createGroupClassSession(req: Request, res: Response) {
    const newClass = new GroupClassSession(req.body);
    return await newClass
        .save()
        .then((obj) => res.status(201).send({ success: true, data: { groupClassSession: obj } }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, message: "Database error, while saving `GroupClassSession`" })
        })
}

//delete group class session
export async function deleteGroupClassSession(req: Request, res: Response) {
    return await GroupClassSession.deleteOne({ _id: req.params.id })
        .then(() => res.send({ success: true, message: 'GroupClassSession deleted' }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, error: "Database error deleting `GroupClassSession`" })
        })
}

//edit group class session
export async function editGroupClassSession(req: Request, res: Response) {
    return await GroupClassSession.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(async (doc) => {
            if (doc)
                return res.status(200).send({ success: true, message: 'GroupClassSession updated', data: { course: doc} })
            else
                return res.status(400).send({ success: false, error: "GroupClassSession doesn't exist" })
        })
}

