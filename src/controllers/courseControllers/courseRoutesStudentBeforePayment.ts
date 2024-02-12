import express, { NextFunction, Request, Response } from "express";
import {
    createStudentRequest,
    deleteStudentRequest,
    studentRequestsByStudent
} from "../studentControllers/groupClassRequests";

const router = express.Router()

router.post('/group', createStudentRequest)
router.delete('/group/delete/:id', deleteStudentRequest)

router.get('/group/:studentId', studentRequestsByStudent)

export const studentGroupCourseBeforePaymentControllers = router;