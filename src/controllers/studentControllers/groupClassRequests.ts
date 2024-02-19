import { Request, Response } from "express";
import { GroupCourseRequest } from "../../models/coursesModels";
import {GroupCoursePayment} from "../../models/paymentModel";

//get all - for admins
export async function studentRequests (req: Request, res: Response) {
    const studentRequests = await GroupCourseRequest.find({});
    return res.send({ success: true, data: { studentRequests: studentRequests } })
}

//get all by student - - for admins and student (author)
export async function studentRequestsByStudent(req: Request, res: Response) {
    const user = res.locals.user;
    const studentId = req.params.studentId;

    if (user.role === 'student') {
        if (studentId !== user.profile) {
            return res.status(403).send({ success: false, message: "You are not authorized to access this resource" });
        }
    }
    try {
        const studentRequests = await GroupCourseRequest.find({ student: user.role === 'student' ? user.profile : req.params.studentId });
        if (studentRequests.length === 0) {
            return res.send({ success: false, message: "No requests found for this student" });
        }

        return res.send({ success: true, data: { studentRequestsByStudent: studentRequests } });
    } catch (error) {
        return res.status(500).send({ success: false, message: "Internal server error" });
    }
}

//create StudentRequest - for students
export async function createStudentRequest(req: Request, res: Response) {
    const newStudentRequest = new GroupCourseRequest(req.body);
    return await newStudentRequest
        .save()
        .then((obj) => res.status(201).send({ success: true, data: { newStudentRequest: obj } }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, message: "Database error, while saving `GroupCourseRequest`" })
        })
}

//delete StudentRequest - for students
export async function deleteStudentRequest(req: Request, res: Response) {
    return await GroupCourseRequest.deleteOne({ _id: req.params.id })
        .then(() => res.send({ success: true, message: 'GroupCourseRequest deleted' }))
        .catch((err) => {
            console.log('Database error: ', err)
            return res.status(500).send({ success: false, error: "Database error deleting `GroupCourseRequest`" })
        })
}

//approve StudentRequest - for admins
export async function approveRequest(req: Request, res: Response) {
    return await GroupCourseRequest.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(async (doc:any) => {
            if (doc)
                return res.status(200).send({ success: true, message: 'GroupCourseRequest updated', data: { course: doc} })
            else
                return res.status(400).send({ success: false, error: "Request doesn't exist" })
        })
}
//decline StudentRequest - for admins
export async function declineRequest(req: Request, res: Response) {
    return await GroupCourseRequest.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        .then(async (doc:any) => {
            if (doc)
                return res.status(200).send({ success: true, message: 'GroupCourseRequest updated', data: { course: doc} })
            else
                return res.status(400).send({ success: false, error: "Request doesn't exist" })
        })
}
///Request payment from student
export async function requestPayment(req: Request, res: Response) {
    // req.body should contain : 'student' - student id; `request` - student's `one to one` request ID

    const classRequest = await GroupCourseRequest.findById(req.body.request)
    if (!classRequest)
        return res.status(404).send({ success: false, error: "Class request lost" })
    if (classRequest.status !== 'approved')
        return res.status(403).send({ success: false, error: "Request is not approved" })

    const paymentRequest = new GroupCoursePayment(req.body)
    return await paymentRequest
        .save()
        .then(() => res.send({ success: true, message: 'Payment request saved' }))
        .catch(() => res.status(500).send({ success: false, error: "Can't save payment request" }))
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