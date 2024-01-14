import express from "express"
import { signIn, signUp } from "./controllers/userControllers";
import { getAcademicAreas } from "./controllers/curatorControllers/curatorUtils";

let router = express.Router()

router.post('/sign-up', signUp)
router.post('/sign-in', signIn)

router.get('/academicAreas', getAcademicAreas)

export const publicRoutes = router;