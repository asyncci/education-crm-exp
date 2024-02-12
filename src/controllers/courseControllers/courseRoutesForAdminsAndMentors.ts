import express, { NextFunction, Request, Response, Router } from "express";
import {createGroupCourse, editGroupCourse} from "./groupCourses.ts";
import {createGroupClass, editGroupClass} from "./groupClasses.ts";
import {createGroupClassSession, editGroupClassSession} from "./GroupClassSessions.ts";

const router = express.Router()

router.post('/group_course', createGroupCourse)
router.put('/group_course/:id', editGroupCourse)

router.post('/group_class', createGroupClass)
router.put('/group_class/:id', editGroupClass)

router.post('/group_session', createGroupClassSession)
router.put('/group_session/:id', editGroupClassSession)

export const courseRoutesForAdminsAndMentors = router