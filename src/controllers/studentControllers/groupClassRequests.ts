import { Request, Response } from "express";
import { StudentRequest } from "../../models/studentRequestModel";
import {GroupCoursePayment} from "../../models/paymentModel.ts";

//get all - for admins
export async function studentRequests (req: Request, res: Response) {
    const studentRequests = await StudentRequest.find({});
    return res.send({ success: true, data: { studentRequests: studentRequests } })
}

//get all by student - - for admins and student (author)
//This method has a duplicate reference in adminControllers/controllers && studentControllers/controllers
export async function studentRequestsByStudent (req: Request, res: Response) {
    const studentId = req.params.studentId;
    const studentRequests = await StudentRequest.find({});
    const studentRequestsByStudent = studentRequests.filter(request => request?.student?.toString() === studentId);
    return res.send({ success: true, data: { studentRequestsByStudent: studentRequestsByStudent } })
}

//get one StudentRequest - for admins and student (author)
//This method has a duplicate reference in adminControllers/controllers && studentControllers/controllers
export async function studentRequest(req: Request, res: Response) {
    const studentRequest = await StudentRequest.find({ _id: req.params.id });
    return res.send({ success: true, data: { studentRequest: studentRequest } })
}

//create StudentRequest - for students
export async function createStudentRequest(req: Request, res: Response) {
    const newStudentRequest = new StudentRequest(req.body);
    return await newStudentRequest
        .save()
        .then((obj) => res.status(201).send({ success: true, data: { newStudentRequest: obj } }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, message: "Database error, while saving `StudentRequest`" })
        })
}

//delete StudentRequest - for students
export async function deleteStudentRequest(req: Request, res: Response) {
    return await StudentRequest.deleteOne({ _id: req.params.id })
        .then(() => res.send({ success: true, message: 'StudentRequest deleted' }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, error: "Database error deleting `StudentRequest`" })
        })
}

//edit StudentRequest - for admins
export async function editStudentRequest(req: Request, res: Response) {
    return await StudentRequest.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(async (doc:any) => {
            if (doc)
                return res.status(200).send({ success: true, message: 'StudentRequest updated', data: { course: doc} })
            else
                return res.status(400).send({ success: false, error: "Request doesn't exist" })
        })
}

/// Get list of payment requests
export async function getPaymentRequests(ref: Request, res: Response) {
    const studentProfile = res.locals.user.profile;
    const requests = await GroupCoursePayment.find({ student: studentProfile })

    return res.send({ success: true, data: { paymentRequests: requests } })
}

/// Submit payment request proof
export async function submitProof(req: Request, res: Response) {
    const { paymentId, photoLink } = req.body;

    return await GroupCoursePayment.findByIdAndUpdate(paymentId, { photoLink: photoLink, status: 'pending' }, { new: true })
        .then((doc) => {
            if (!doc)
                return res.status(404).send({success: false, error: "No data"})

            return res.send({ success: true, message: 'Link updated'})
        })
        .catch(() => res.status(500).send({ success: false, error: "Can't update link"}))
}