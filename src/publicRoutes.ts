import express from "express"
import { signIn, signUp } from "./controllers/userControllers";
import {getAcademicAreas} from "./controllers/academicAreaControllers.ts";
import {courses} from "./controllers/courseControllers";
import {getReview, getReviews} from "./controllers/reviewControllers.ts";
import {contactServices} from "./controllers/studentControllers/profileManagementControllers.ts";

let router = express.Router()

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)

router.get('/academicAreas', getAcademicAreas)
router.get('/courses', courses)
router.get('/reviews', getReviews)
router.get('/reviews/:id', getReview)
//Instagram, Email, WeChat:
router.get('/contactServices', contactServices)
export const publicRoutes = router;