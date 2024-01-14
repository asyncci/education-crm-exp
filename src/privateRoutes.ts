import express, { NextFunction, Response, Request } from "express"
import { verify } from 'jsonwebtoken'
import { config } from "../config";
import { createMentorProfile, deleteMentorProfile, updateMentorProfile } from "./controllers/profileControllers/mentorProfileControllers";
import { createStudentProfile, deleteStudentProfile, updateStudentProfile } from "./controllers/profileControllers/studentProfileControllers";
import { createProject, deleteProject } from "./controllers/projectControllers";
import { curatorControllers } from "./controllers/curatorControllers/controllers";
import { studentControllers } from "./controllers/studentControllers/controllers";

let router = express.Router()

function authorization(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization || req.body.authorization;
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

router.use('/curator', curatorControllers)

router.use('/student', studentControllers)


export const privateRoutes = router;