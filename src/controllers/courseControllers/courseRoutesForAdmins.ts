import express, { NextFunction, Request, Response, Router } from "express";
import {deleteGroupCourse} from "./groupCourses.ts";
import {deleteGroupClass} from "./groupClasses.ts";
import {deleteGroupClassSession} from "./GroupClassSessions.ts";
import {studentRequests, studentRequestsByStudent} from "../studentControllers/groupClassRequests.ts";

const router = express.Router()

router.delete('/group_course/:id', deleteGroupCourse)
router.delete('/group_class/:id', deleteGroupClass)
router.delete('/group_session/:id', deleteGroupClassSession)

//get group course requests from all students
router.get('/group', studentRequests)
router.get('/group/:studentId', studentRequestsByStudent)

export const courseRoutesForAdmins = router