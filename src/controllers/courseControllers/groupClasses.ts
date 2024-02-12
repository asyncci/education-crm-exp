import {Request, Response} from "express";
import {GroupClass} from "../../models/coursesModels";

//get all
export async function groupClasses(req: Request, res: Response) {
    try {
        const groupClasses = await GroupClass.find({});
        const user = res.locals.user;
        if (user.role === 'student') {
            const accessibleClasses = groupClasses.filter(groupClass => groupClass.students.includes(user.profile.toString()));
            return res.send({ success: true, data: { groupClasses: accessibleClasses } });
        } else {
            return res.send({ success: true, data: { groupClasses: groupClasses } });
        }
    } catch (error) {
        console.error('Error fetching group classes:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

//get one group class
export async function groupClass(req: Request, res: Response) {
    const groupClass = await GroupClass.find({_id: req.params.id});
    return res.send({success: true, data: {groupClass: groupClass}})
}

//create group class
export async function createGroupClass(req: Request, res: Response) {
    const newClass = new GroupClass(req.body);
    return await newClass
        .save()
        .then((obj) => res.status(201).send({success: true, data: {groupClass: obj}}))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({success: false, message: "Database error, while saving `GroupClass`"})
        })
}

//delete group class
export async function deleteGroupClass(req: Request, res: Response) {
    return await GroupClass.deleteOne({_id: req.params.id})
        .then(() => res.send({success: true, message: 'GroupClass deleted'}))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({success: false, error: "Database error deleting `GroupClass`"})
        })
}

//edit group class
export async function editGroupClass(req: Request, res: Response) {
    return await GroupClass.findOneAndUpdate({_id: req.params.id}, req.body, {new: true})
        .then(async (doc) => {
            if (doc)
                return res.status(200).send({success: true, message: 'GroupClass updated', data: {course: doc}})
            else
                return res.status(400).send({success: false, error: "GroupClass doesn't exist"})
        })
}

