import express, {NextFunction, Request, Response} from "express"
import {verify} from 'jsonwebtoken'
import {config} from "../config";
import {adminControllers} from "./controllers/adminControllers/controllers";
import {studentControllers} from "./controllers/studentControllers/controllers";
import {deleteReview} from "./controllers/reviewControllers";
import {getStudent} from "./controllers/studentControllers/profile.ts";
import {mentorControllers} from "./controllers/mentorControllers/controllers.ts";
import {getAllMentors, getMentor} from "./controllers/mentorControllers/profile.ts";
import {blogControllers} from "./controllers/blogControllers/controllers.ts";
import {loggedInUserControllers} from "./controllers/blogControllers/loggedInUserControllers.ts";

let router = express.Router()

function authorization(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization || req.body.authorization;

    if (token) {
        const verified = verify(token, config.secretKey)

        if (!verified) {
            return res.status(401).send({
                success: false,
                error: 'Failed to authenticate token'
            })
        }

        next()
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token'
        });
    }
}

router.use(authorization)

router.use('/admin', adminControllers)
router.use('/student', studentControllers)
router.use('/instructor', mentorControllers)

//delete student's review by review id - available to students, instructors, and admins
router.delete('/reviews/delete/:id', deleteReview)

//view student profile
router.get('/profile/student/:profileId', getStudent)
router.get('/profile/instructor/:profileId', getMentor)

//view all mentors
router.get('/instructors', getAllMentors)

//blogs
router.use('/blog', blogControllers)
router.use('/blog/in', loggedInUserControllers)

export const privateRoutes = router;