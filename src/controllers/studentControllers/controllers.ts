import express, { NextFunction, Request, Response } from "express";
import { User } from "../../models/userModel";
import { createStudentProfile, deleteStudentProfile, updateStudentProfile } from "./profile";
import { getPaymentRequests, getRequests, requestOneToOne, submitProof } from "./oneToOneClassRequests";
import { StudentProfile } from "../../models/profileModel";
import { createReview, editReview } from "../reviewControllers.ts";
import { studentGroupCourseBeforePaymentControllers } from "../courseControllers/courseRoutesStudentBeforePayment.ts";
import {
    courseRoutesAdminsMentorsStudentsWhoPaid
} from "../courseControllers/courseRoutesAdminsMentorsStudentsWhoPaid.ts";
import {
    createRequestIC,
    getStudentICRequests
} from "../individualCourseControllers.ts";
import { optimizeNextInvocation } from "bun:jsc";
const router = express.Router()

async function checkStudent(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization || req.body.authorization;
    //const user = await User.findOne({token: auth})
    const user = await User.findOne({ role: "student" })

    if (!user)
        return res.status(400).send({ success: false, error: 'No user for such token' })

    if (user.role !== 'student')
        return res.status(403).send({ success: false, error: "You are not `student`" })

    res.locals.user = user;
    createProfile(req, res)
    next()
}

async function createProfile(req: Request, res: Response) {
    const user = res.locals.user;
    const isProfile = await StudentProfile.findById(user.profile);

    if (isProfile)
        return

    const { body } = req;
    const newProfile = new StudentProfile(body);

    try {
        const savedProfile = await newProfile.save();
        await User.updateOne({ _id: user._id }, { $set: { profile: savedProfile._id } });

        return;
    } catch (error) {
        console.error('Error saving profile:', error);
        return;
    }
}


async function checkProfile(req: Request, res: Response, next: NextFunction) {
    const id = res.locals.user.profile
    const profile = await StudentProfile.findById(id)
    if (!profile)
        return res.status(403).send({ success: false, error: "Please create profile first" })

    res.locals.student = profile;

    next()
}

router.use(checkStudent)

//profile
router.post('', createStudentProfile)
router.put('', updateStudentProfile)
router.delete('', deleteStudentProfile)

router.use(checkProfile)
//make request
router.post('/request', createRequestIC)
//get requests for particular student
router.get('/requests', getStudentICRequests)
//approved class request, so payment request appears for student, so he should pay
router.get('/payments', getPaymentRequests)
//here student submits photo
router.put('/submit', submitProof)


//create review (for a course)
router.post('/reviews/new', createReview)
//edit review (for a course)
router.put('/reviews/edit', editReview)

//group courses
router.use('', studentGroupCourseBeforePaymentControllers)
router.use('', courseRoutesAdminsMentorsStudentsWhoPaid)

export const studentControllers = router;