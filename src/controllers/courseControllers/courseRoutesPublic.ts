import express, { NextFunction, Request, Response, Router } from "express";
import {groupCourse, groupCourses} from "./groupCourses";

const router = express.Router()

router.get('/group_course', groupCourses)
router.get('/group_course/:id', groupCourse)


export const courseRoutesPublic = router