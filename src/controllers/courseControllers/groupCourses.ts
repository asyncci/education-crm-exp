import { Request, Response } from "express";
import {GroupCourse} from "../../models/coursesModels";


//get all 
export async function groupCourses(req: Request, res: Response) {
    const groupCourses = await GroupCourse.find({});
    return res.send({ success: true, data: { groupCourses: groupCourses } })
}

//get one course
export async function groupCourseClear(req: Request, res: Response) {
    const groupCourse = await GroupCourse.find({ _id: req.params.id });
    return res.send({ success: true, data: { groupCourse: groupCourse } })
}

//get course with applying data
export async function groupCourse(req: Request, res: Response) {
    const groupCourses = await GroupCourse.find({});
    return res.send({ success: true, data: { groupCourses: groupCourses } })
}

//create course
export async function createGroupCourse(req: Request, res: Response) {
    const newCourse = new GroupCourse(req.body);
    return await newCourse
        .save()
        .then((obj) => res.status(201).send({ success: true, data: { course: obj } }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, message: "Database error, while saving `GroupCourse`" })
        })
}

//delete course
export async function deleteGroupCourse(req: Request, res: Response) {
    return await GroupCourse.deleteOne({ _id: req.params.id })
        .then(() => res.send({ success: true, message: 'GroupCourse deleted' }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, error: "Database error deleting `GroupCourse`" })
        })
}

//edit course
export async function editGroupCourse(req: Request, res: Response) {
    return await GroupCourse.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(async (doc) => {
            if (doc)
                return res.status(200).send({ success: true, message: 'GroupCourse updated', data: { course: doc} })
            else
                return res.status(400).send({ success: false, error: "GroupCourse doesn't exist" })
        })
}

