import express, { NextFunction, Request, Response, Router } from "express";
import { optimizeNextInvocation } from "bun:jsc";
import { User } from "../../models/userModel";
import {
    createMentorProfile,
    deleteMentorProfile,
    updateMentorProfile
} from "./profile";
import {courseRoutesForAdminsAndMentors} from "../courseControllers/courseRoutesForAdminsAndMentors.ts";
import {
    courseRoutesAdminsMentorsStudentsWhoPaid
} from "../courseControllers/courseRoutesAdminsMentorsStudentsWhoPaid.ts";

const router = express.Router()
async function checkMentor(req: Request, res: Response, next: NextFunction) {

    const auth = req.headers.authorization || req.body.authorization;
    const user = await User.findOne({ role: "mentor" })

    if (!user)
        return res.status(400).send({ success: false, error: 'No user for such token' })

    if (user.role !== 'mentor')
        return res.status(403).send({ success: false, error: "You are not `instructor`" })

    res.locals.user = user
    next()
}

router.use(checkMentor);

//profile routes:
router.put('', updateMentorProfile)
router.delete('', deleteMentorProfile)
router.post('', createMentorProfile)
//group courses
router.use('', courseRoutesForAdminsAndMentors)
router.use('', courseRoutesAdminsMentorsStudentsWhoPaid)


export const mentorControllers = router
