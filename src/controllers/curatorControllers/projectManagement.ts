import { Request, Response } from "express";
import { AcademicArea } from "../../models/academicAreaModel";
import { RequestOneToOneClass } from "../../models/oneToOneClassModel";
import { RequestPayment } from "../../models/paymentModel";

///Get requested classes, waiting for approvement
export async function getRequestsFromStudents(_: Request, res: Response) {
    const requests = await RequestOneToOneClass.find({})

    return res.send({ success: true, data: { studentRequests: requests } })
}


///Student request approvement/declinment
export async function changeStudentRequestStatus(req: Request, res: Response) {
    //status is either `approved` or `declined`
    const { requestId, status } = req.body;

    return await RequestOneToOneClass.findByIdAndUpdate(requestId, { status: status }, { new: true })
        .then(async (doc) => {
            if (doc) return res.send({ success: true, message: "Status of student's request changed" })

            return res.status(404).send({ success: false, error: 'Incorrect request ID' })
        })
        .catch(() => res.status(500).send({ success: false, error: "Can't update request" }))

}
/// ----------------


///Request payment from student 
export async function requestPayment(req: Request, res: Response) {
    // req.body should contain : 'student' - student id; `request` - student's `one to one` request ID

    const classRequest = await RequestOneToOneClass.findById(req.body.request)
    if (!classRequest)
        return res.status(404).send({ success: false, error: "Class request lost" })
    if (classRequest.status !== 'approved')
        return res.status(403).send({ success: false, error: "Request is not approved" })

    const paymentRequest = new RequestPayment(req.body)
    return await paymentRequest
        .save()
        .then(() => res.send({ success: true, message: 'Payment request saved' }))
        .catch(() => res.status(500).send({ success: false, error: "Can't save payment request" }))
}

/// --------------
