import express, { NextFunction, Request, Response } from "express";
import { User } from "../../models/userModel";
import { createStudentProfile, deleteStudentProfile, updateStudentProfile } from "./profile";
import { getPaymentRequests, getRequests, requestOneToOne, submitProof } from "./requests";
import { StudentProfile } from "../../models/profileModel";

const router = express.Router()

async function checkStudent(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization || req.body.authorization;
    const user = await User.findOne({ token: auth })

    if (!user)
        return res.status(400).send({ success: false, error: 'No user for such token' })

    if (user.role !== 'student')
        return res.status(403).send({ success: false, error: "You are not `student`" })

    res.locals.user = user;
    next()
}


async function checkProfile(req: Request, res: Response, next: NextFunction) {
    const id = res.locals.user.profile
    const profile = await StudentProfile.findById(id)
    if (!profile)
        return res.status(403).send({ success: false, error: "Please create profile first" })

    next()
}

router.use(checkStudent)

//profile
router.post('', createStudentProfile)
router.put('', updateStudentProfile)
router.delete('', deleteStudentProfile)

router.use(checkProfile)
//make request
router.post('/request', requestOneToOne)
//get requests for particular student
router.get('/requests', getRequests)
//approved class request, so payment request appears for student, so he should pay
router.get('/payments', getPaymentRequests)
//here student submits photo
router.put('/submit', submitProof)

export const studentControllers = router;