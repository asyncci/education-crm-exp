import { Request, Response } from "express";
import { RequestOneToOneClass } from "../../models/oneToOneClassModel";
import { RequestPayment } from "../../models/paymentModel";

/// Request mentor to `one to one` course
export async function requestOneToOne(req: Request, res: Response) {
    const studentUser = res.locals.user;
    const fields = { ...req.body, student: studentUser.profile }
    const newRequest = new RequestOneToOneClass(fields)

    return await newRequest
        .save()
        .then((requestObj) => res.send({ success: true, message: "Request sent", data: { studentRequest: requestObj } }))
        .catch(() => res.status(500).send({ success: false, error: "Can't save request" }))
}


/// Get list of student's `one to one` requests
export async function getRequests(req: Request, res: Response) {
    const studentProfile = res.locals.user.profile;
    const requests = await RequestOneToOneClass.find({ student: studentProfile })

    return res.send({ status: true, data: { studentRequests: requests } })
}

/// Get list of payment requests
export async function getPaymentRequests(ref: Request, res: Response) {
    const studentProfile = res.locals.user.profile;
    const requests = await RequestPayment.find({ student: studentProfile })

    return res.send({ success: true, data: { paymentRequests: requests } })
}

/// Submit payment request proof
export async function submitProof(req: Request, res: Response) {
    const { paymentId, photoLink } = req.body;

    return await RequestPayment.findByIdAndUpdate(paymentId, { photoLink: photoLink, status: 'pending' }, { new: true })
        .then((doc) => {
            if (!doc) 
                return res.status(404).send({success: false, error: "No data"})
            
            return res.send({ success: true, message: 'Link updated'})
        })
        .catch(() => res.status(500).send({ success: false, error: "Can't update link"}))
}