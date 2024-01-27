import express from "express"
import { signIn, signUp } from "./controllers/userControllers";
import { getAcademicAreas } from "./controllers/adminControllers/curatorUtils";
import { courses } from "./controllers/courseControllers";

let router = express.Router()

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)

router.get('/academicAreas', getAcademicAreas)
router.get('/courses', courses)

export const publicRoutes = router;