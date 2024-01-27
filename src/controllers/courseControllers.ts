import { Request, Response } from "express";
import { Course } from "../models/courseModel";

//get all 
export async function courses(req: Request, res: Response) {
    const courses = await Course.find({});
    return res.send({ success: true, data: { courses: courses } })
}

//get one course
export async function course(req: Request, res: Response) {
    const courses = await Course.find({ _id: req.params.id });
    return res.send({ success: true, data: { courses: courses } })
}

//create course
export async function createCourse(req: Request, res: Response) {
    const newCourse = new Course(req.body);
    return await newCourse
        .save()
        .then((obj) => res.status(201).send({ success: true, data: { course: obj } }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, message: "Database error, while saving `Course`" })
        })
}

//delete course
export async function deleteCourse(req: Request, res: Response) {
    return await Course.deleteOne({ _id: req.params.id })
        .then(() => res.send({ success: true, message: 'Course deleted' }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, error: "Database error deleting `Course`" })
        })
}

//edit course
export async function editCourse(req: Request, res: Response) {
    return await Course.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(async (doc) => {
            if (doc)
                return res.status(200).send({ success: true, message: 'Course updated', data: { course: doc} })
            else
                return res.status(400).send({ success: false, error: "Profile doesn't exist" })
        })
}

