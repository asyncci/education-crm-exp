import express, { NextFunction, Request, Response, Router } from "express";
import {groupCourse, groupCourseClear, groupCourses} from "./groupCourses";

const router = express.Router()

router.get('/group_course', groupCourses)
router.get('/group_course/:id', groupCourse)
router.get('/group_course_clear/:id', groupCourseClear)

export const courseRoutesPublic = router