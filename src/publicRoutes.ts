import express from "express"
import { signIn, signUp } from "./controllers/userControllers";
import {getAcademicAreas} from "./controllers/academicAreaControllers.ts";
import {getReview, getReviews} from "./controllers/reviewControllers.ts";
import {courseRoutesPublic} from "./controllers/courseControllers/courseRoutesPublic.ts";
import {contactServices} from "./controllers/profileControllers/contactsManagementControllers.ts";
import {publicBlogControllers} from "./controllers/blogControllers/publicBlogRoutes.ts";

let router = express.Router()

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)

router.get('/academicAreas', getAcademicAreas)
router.use('', courseRoutesPublic)
router.get('/reviews', getReviews)
router.get('/reviews/:id', getReview)
//Instagram, Email, WeChat:
router.get('/contactServices', contactServices)

//blogs
router.use('/blogs', publicBlogControllers)

export const publicRoutes = router;